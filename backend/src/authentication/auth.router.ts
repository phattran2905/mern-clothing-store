import { Router } from "express"
import {
	login,
	logout,
	requestForPasswordReset,
	resetPassword,
	sendResetPasswordEmail,
	signUp,
} from "./auth.controller"
import { validateJWT } from "../middleware/jwtAuthentication"

const authRouter = (router: Router) => {
	router
		.post("/sign-up", signUp)
		.post("/login", login)
		.post("/logout", validateJWT, logout)
		.post("/reset-password/send-email", sendResetPasswordEmail)
		.post("/reset-password", requestForPasswordReset)
		.put("/reset-password", resetPassword)
}

export default authRouter
