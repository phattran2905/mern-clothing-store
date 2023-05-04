import { Response, Router, Request } from "express"
import { login } from "./auth.controller"

const authRouter = (router: Router) => {
	router.get("/login", login)
}

export default authRouter
