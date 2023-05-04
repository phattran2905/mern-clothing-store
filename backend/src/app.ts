
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './router';
import { errorHandler } from './middleware/errorHandler';

const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.use(router)
app.use(errorHandler)

export default app