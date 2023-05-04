import {Router} from 'express';
import { signUp } from './signUp.controller';

const signUpRouter = (router: Router) => {
    router.post('/sign-up', signUp)
}

export default signUpRouter