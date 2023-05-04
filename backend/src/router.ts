import {Router} from 'express';
import authRouter from './authentication/auth.router';
import signUpRouter from './signUp/signUp.router';

const router = Router()

// Routes
authRouter(router)
signUpRouter(router)

export default router

