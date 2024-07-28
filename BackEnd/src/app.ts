import express, { Application} from 'express'
import cors from 'cors'
import router from './routes/userRoute'
import { config } from 'dotenv'
import adminRouter from './routes/adminRoutes'
import connectDb from './DB/connection/connect'

config()
 
connectDb()


const port:number=8001
const app: Application = express()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({origin: 'http://localhost:4200', credentials: true}))

app.use('/', router)
app.use('/admin',adminRouter)

app.listen(port,() => {
    console.log('server running')
})