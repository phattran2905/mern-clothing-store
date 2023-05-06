import {Router} from 'express';
import { validateJWT } from '../middleware/jwtAuthentication';
import { isAdminRole } from '../middleware/roleChecking';
import { getAllAccounts } from './account.controller';


const accountRouter = (router: Router) => {
	router
		.get("/admin/accounts", validateJWT, isAdminRole, getAllAccounts)
}

export default accountRouter
