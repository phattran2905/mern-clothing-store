import { Router } from "express"
import authRouter from "./authentication/auth.router"

const router = Router()

// Routes
authRouter(router)

export default router
