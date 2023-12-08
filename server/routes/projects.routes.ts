import { Router } from 'express'

import { Project } from '../controller/project.controller'

export const projectRouter = Router()

projectRouter.get('/:id', Project.getAllProjects)
projectRouter.get('/seleccionado/:id', Project.getProject)
projectRouter.get('/proyecto/activo', Project.getActiveProject)
projectRouter.post('/usuario/:id', Project.createProject)
projectRouter.put('/proyecto/:id', Project.updateProject)
projectRouter.put('/proyecto/seleccionado/:id', Project.updateActiveProject)
projectRouter.delete('/proyecto/:_userId/:_projectId', Project.deleteProject)
