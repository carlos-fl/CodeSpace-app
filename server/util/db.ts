import mongoose from 'mongoose'

export class DB {
  server = 'localhost'
  port = '27017'
  database = 'codespace'

  dbConnection = `mongodb://${this.server}:${this.port}/${this.database}`

  constructor() {
    try {
      mongoose.connect(this.dbConnection)
      console.log('connected to mongodb')
    } catch(e) {
      console.log('Could not connect to mongo')
    }
  }
}