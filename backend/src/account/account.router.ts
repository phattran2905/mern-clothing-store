import { Router } from "express"
import { validateJWT } from "../middleware/jwtAuthentication"
import { isAdminRole } from "../middleware/roleChecking"
import { getAccountById, getAllAccounts, removeAccountById } from "./account.controller"

const accountRouter = (router: Router) => {
	router
		.get("/admin/accounts", validateJWT, isAdminRole, getAllAccounts)
		.get("/admin/accounts/:id", validateJWT, isAdminRole, getAccountById)
		.delete("/admin/accounts/:id", validateJWT, isAdminRole, removeAccountById)
}

export default accountRouter
