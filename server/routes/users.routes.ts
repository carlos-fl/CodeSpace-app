import { Router } from "express";

import { User } from "../controller/user.controller";

export const userRouter = Router()

userRouter.get('/cuenta/:id', User.getUser)
userRouter.get('/', User.getAllUsers)
userRouter.get('/activo', User.getActiveUser)
userRouter.post('/usuario/login', User.userLogin)
userRouter.post('/usuario', User.createUser)
userRouter.put('/usuario/:id', User.update)
userRouter.put('/usuario/:id/proyecto', User.updateProjects)
userRouter.put('/usuario/:id/logout', User.logOut)