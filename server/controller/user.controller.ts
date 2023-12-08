import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { usersDB } from '../models/user.schema'

export class User {

  static async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.id
      const user = await usersDB.findById(userId)
      if(user) res.send({ user: user, found: true })
      else res.send({ found: false })
    } catch(err) {
      res.send({ found: false })
    }
  }

  static async userLogin(req: Request, res: Response) {
    try {
      const name = req.body.name
      const passwd = req.body.password

      const user = await usersDB.findOne({ name: name })
      if(user) {
        const isCorrectUser = await bcrypt.compare(passwd, user.password)
        if(isCorrectUser) {
          const activeUser = await usersDB.findOne({ active: true })
          if(activeUser) {
            activeUser.active = false
            const updated = await usersDB.updateOne({ _id: activeUser._id }, activeUser)
          }
          user.active = true
          const updatedActiveUser = await usersDB.updateOne({ _id: user._id }, user)
          res.send({ login: true, error: false, user: user })
        }
        else  res.send({ login: false, error: false })
      } else res.send({ login: false, error: false })

    } catch(err) {
      res.send({ login: false, error: true })
    }
  }

  static async createUser(req: Request, res: Response) {
    const userName = req.body.name
    const projects = req.body.projects
    
    const userWithSameName = await usersDB.findOne({ name: userName })
    const activeUser = await usersDB.findOne({ active: true })
    if(activeUser && !userWithSameName) {
      activeUser.active = false
      const updated = await usersDB.updateOne({ _id: activeUser._id }, activeUser)
    }
    if(!userWithSameName) {
      const saltRounds = 10
      const hashedPasswd = await bcrypt.hash(req.body.password, saltRounds)

      const user = {
        name: userName,
        password: hashedPasswd,
        plan: req.body.plan,
        active: true,
        shared: 0,
        projects: projects
      }

      const newUser = new usersDB(user)
      newUser.save().then(response => {
        res.send({ created: true })
      }).catch((e => {
        res.send(e)
      }))

      return
    }

    res.send({ created: false, repeatedUser: true })
  }

  static async update(req: Request, res: Response) {
    const userId = req.params.id
    const user = await usersDB.findById(userId)
    if(user) {
      user.plan = req.body.plan
      usersDB.updateOne({ _id: userId }, user).then(() => {
        res.send({ updated: true })
      }).catch(err => {
        res.send({ updated: false })
      })
    }
  }

  static async getActiveUser(req: Request, res: Response) {
    try {
      const activeUser = await usersDB.findOne({ active: true })
      if(activeUser) res.send({ activeUser: activeUser })
      else res.send({ activeUser: null })
    } catch(err) {
      res.send({ error: true })
    }
  }

  static async logOut(req: Request, res: Response) {
    const userId = req.params.id
    try {
      const user = await usersDB.findOne({ active: true })
      if(user) {
        user.active = false
        const updated = await usersDB.updateOne({ _id: userId }, user)
        res.send({ logout: true })
      } else res.send({ logout: false, error: false })
    } catch(err) {
      res.send({ logout: false, error: true })
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await usersDB.find({})
      res.send({ users: users, found: true })
    } catch(err) {
      res.send({ found: false })
    }
  }

  static async updateProjects(req: Request, res: Response) {
    const userId = req.params.id
    try {
      const activeUser = await usersDB.findOne({ active: true })
      const user = await usersDB.findById(userId)
      if(user && activeUser) {
        let maxProjects = 3
        let shares = 0
        if(user.plan == 'Basico') maxProjects = 3
        if(user.plan == 'Pro') maxProjects = 10 
        if(activeUser.plan == 'Pro') shares = 3 
        if(user.plan == 'Premium') maxProjects = 15
        if(activeUser.plan == 'Premium') shares = 25
        if(user.projects.length < maxProjects && activeUser.shared < shares) {
          user.projects.push(req.body.newProject)
          const updated = await usersDB.updateOne({ _id: userId }, user)
          activeUser.shared += 1
          const activeUserUpdated = await usersDB.updateOne({ _id: activeUser._id }, activeUser)
          res.send({ projectsUpdated: true })
        } else res.send({ max: true })
      } else res.send({ projectsUpdated: false })
    } catch(err) {
      res.send({ projectsUpdated: false })
      console.log(err)
    }
  }
}