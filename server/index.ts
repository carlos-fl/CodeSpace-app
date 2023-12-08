import express, { Express, Request, Response } from 'express'
import cors from 'cors'

import { userRouter } from './routes/users.routes'
import { projectRouter } from './routes/projects.routes'
import { DB } from './util/db'

const app: Express = express()
const port: string|number = process.env.PORT || 3000
const db = new DB()

app.use(cors())
app.use(express.json())
app.use('/usuarios', userRouter)
app.use('/proyectos', projectRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('servidor levantado')
})

app.listen(port, () => {
  console.log(`servidor levantado en http://localhost:${port}`)
})