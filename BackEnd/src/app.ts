import express, { Application} from 'express'
import cors from 'cors'
import router from './routes/userRoute'
import { config } from 'dotenv'
import adminRouter from './routes/adminRoutes'
import connectDb from './DB/connection/connect'
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from 'express-fileupload';
config()
 
connectDb()


const port:number=8001
const app: Application = express()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

app.use(express.json({ limit: "100mb" }));
app.use(
express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 2 * 1024 * 1024 },
}))

 

app.use(cors({origin: 'http://localhost:4200', credentials: true}))

app.use('/', router)
app.use('/admin',adminRouter)

app.listen(port,() => {
    console.log('server running')
})