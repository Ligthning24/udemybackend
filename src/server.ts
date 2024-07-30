import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes'
import proyectRoutes from './routes/proyectRoutes'

dotenv.config()

connectDB()

const app = express();
app.use(cors(corsConfig))
app.use(morgan('dev'))
app.use(express.json())
//Routes
app.use('/api/auth',authRoutes)
app.use('/api/projects',proyectRoutes)


export default app