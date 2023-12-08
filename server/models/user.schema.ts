import mongoose from 'mongoose'
import { User } from './user.model'

const schema = new mongoose.Schema<User>({
  name: String,
  password: String,
  plan: String,
  active: Boolean,
  shared: Number,
  projects: Array<mongoose.Types.ObjectId>,
})

const usersDB = mongoose.model('users', schema)

export { usersDB }