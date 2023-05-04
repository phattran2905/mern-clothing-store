import { Response, Router, Request } from "express"
import { login } from "./auth.controller"

const authRouter = (router: Router) => {
	router.post("/login", login)
}

export default authRouter
