import { Router } from "express"
import { validateJWT } from "../middleware/jwtAuthentication"
import { isAdminRole } from "../middleware/roleChecking"
import {
    changeAccountRole,
	createNewAccount,
	getAccountById,
	getAllAccounts,
	removeAccountById,
	updateAccountStatusById,
} from "./account.controller"

const accountRouter = (router: Router) => {
	router
		.get("/admin/accounts", validateJWT, isAdminRole, getAllAccounts)
		.post("/admin/accounts", validateJWT, isAdminRole, createNewAccount)
		.get("/admin/accounts/:id", validateJWT, isAdminRole, getAccountById)
		.delete("/admin/accounts/:id", validateJWT, isAdminRole, removeAccountById)
		.put("/admin/accounts/status/:id", validateJWT, isAdminRole, updateAccountStatusById)
        .put("/admin/accounts/role/:id", validateJWT, isAdminRole, changeAccountRole)
}

export default accountRouter
