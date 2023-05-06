import { Router } from "express"
import authRouter from "./authentication/auth.router"
import accountRouter from "./account/account.router"

const router = Router()

// Routes
authRouter(router)
accountRouter(router)

export default router
