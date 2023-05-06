import {Router} from 'express';
import { validateJWT } from '../middleware/jwtAuthentication';
import { isAdminRole } from '../middleware/roleChecking';
import { getAccountById, getAllAccounts } from './account.controller';


const accountRouter = (router: Router) => {
	router
		.get("/admin/accounts", validateJWT, isAdminRole, getAllAccounts)
        .get("/admin/accounts/:id",validateJWT, isAdminRole, getAccountById)
}

export default accountRouter
