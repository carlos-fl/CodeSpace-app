import mongoose from 'mongoose'

import { Projects } from './project.model'

const schema = new mongoose.Schema<Projects>({
  projectName: String,
  type: String,
  active: Boolean,
  code: Object
})

const projectsDB = mongoose.model('projects', schema)

export { projectsDB }