import mongoose from 'mongoose'

export interface User {
  name: string,
  password: string,
  plan: string,
  active: boolean,
  shared: number,
  projects: Array<mongoose.Types.ObjectId>,
}