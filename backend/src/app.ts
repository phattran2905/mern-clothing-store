
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan("dev"))

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
})

export default app