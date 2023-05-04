import { Router } from "express"
import { login, logout } from "./auth.controller"
import { validateJWT } from "../middleware/jwtAuthentication"

const authRouter = (router: Router) => {
	router.post("/login", login)
	router.post("/logout", validateJWT, logout)
}

export default authRouter
