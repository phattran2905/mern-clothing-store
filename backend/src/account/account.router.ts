import { Router } from "express"
import { validateJWT } from "../middleware/jwtAuthentication"
import { isAdminRole } from "../middleware/roleChecking"
import { getAccountById, getAllAccounts, removeAccountById, updateAccountStatusById } from "./account.controller"

const accountRouter = (router: Router) => {
	router
		.get("/admin/accounts", validateJWT, isAdminRole, getAllAccounts)
		.get("/admin/accounts/:id", validateJWT, isAdminRole, getAccountById)
		.delete("/admin/accounts/:id", validateJWT, isAdminRole, removeAccountById)
		.put("/admin/accounts/status/:id", validateJWT, isAdminRole, updateAccountStatusById)
}

export default accountRouter
