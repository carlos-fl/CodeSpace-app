import mongoose from 'mongoose'

export interface Projects {
  projectName: string,
  type: string,
  active: boolean,
  code: Object
}