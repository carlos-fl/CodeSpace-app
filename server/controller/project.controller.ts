import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { projectsDB } from "../models/project.schema";
import { usersDB } from '../models/user.schema';

export class Project {
  static async createProject(req: Request, res: Response) {
    try {
      const userId = req.params.id
      const user = await usersDB.findById(userId)
      if(user) {
        let maxProjects = 3
        if(user.plan == 'Basico') maxProjects = 3
        if(user.plan == 'Pro') maxProjects = 10
        if(user.plan == 'Premium') maxProjects = 15
        if(user.projects.length < maxProjects) {
          const newProject = new projectsDB(req.body)
          newProject.save()
          .then(resp => {
            user.projects.push(newProject._id)
            usersDB.updateOne({ _id: userId }, user).then(() => {
              res.send({ projectCreated: true, max: false })
            })
          })
        } else res.send({ projectCreated: false, max: true })
      } else{
        res.send({ projectCreated: false, message: 'user does not exist', max: false })
      }
    } catch(err) {
      res.send({ projectCreated: false, max: false })
    }
  }

  static async updateProject(req: Request, res: Response) {
    try {
      const projectId = req.params.id
      const project = await projectsDB.findById(projectId)
      if(project) {
        project.code = req.body
        const updatedCode = await projectsDB.updateOne({ _id: projectId }, project)
        res.send({ updated: true })
      } else 
        res.send( {updated: false, message: 'proyecto no existe' })
    } catch(err) {
      res.send({ updated: false })
    }
  }

  static async getAllProjects(req: Request, res: Response) {
    try {
      const user = await usersDB.findById(req.params.id)
      if(user) {
        const projects = await projectsDB.find({ _id: user.projects })
        res.send({ projects: projects, projectsFound: true })
      }
    } catch(err) {
      res.send({ projectsFound: false })
    }
  }

  static async deleteProject(req: Request, res: Response) {
    const userId = req.params._userId
    const projectId = req.params._projectId

    try {
      const deletedProject = await projectsDB.deleteOne({ _id: projectId })
      const user = await usersDB.findById(userId)
      if(user) {
        const sharedProjectUsers = await usersDB.find({ projects: projectId })
        const projectIndex = user.projects.indexOf(new mongoose.Types.ObjectId(projectId))
        user.projects.splice(projectIndex, 1)
        if(sharedProjectUsers.length > 0) user.shared -= 1
        const updated = await usersDB.updateOne({ _id: userId }, user)

        sharedProjectUsers.forEach(async userShared => {
          const userProjects = userShared.projects
          const index = userProjects.indexOf(new mongoose.Types.ObjectId(projectId))
          userProjects.splice(index, 1)
          const updated = await usersDB.updateOne({ _id: userShared._id }, userShared)
        })

        res.send({ deleted: true, compartidos: sharedProjectUsers })
      }
    } catch(err) {
      res.send({ deleted: false })
    }
  }

  static async getProject(req: Request, res: Response) {
    try {
      const projectId = req.params.id
      const project = await projectsDB.findById(projectId)
      if(project)
        res.send(project)
    } catch(err) {
      res.send({ projectFound: false })
    }
  }

  static async updateActiveProject(req: Request, res: Response) {
    const projectId = req.params.id
    try {
      const project = await projectsDB.findById(projectId)
      const currentActiveProject = await projectsDB.findOne({ active: true })

      if(currentActiveProject) {
        currentActiveProject.active = false
        const updated = await projectsDB.updateOne({ _id: currentActiveProject._id }, currentActiveProject)
      }
      if(project) {
        project.active = true
        const updated = await projectsDB.updateOne({ _id: projectId }, project)
        res.send({ setActive: true })
        return
      } else res.send({ setActive: false, error: false })
    } catch(err) {
      res.send({ setActive: false, error: true })
    }
  } 

  static async getActiveProject(req: Request, res: Response) {
    try {
      const project = await projectsDB.findOne({ active: true })
      if(project) res.send({ project: project, projectActive: true })
      else res.send({ projectActive: false })
    } catch(err) {
      res.send({ projectActive: false })
    }
  }
}