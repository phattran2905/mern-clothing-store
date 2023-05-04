import { Response, Request, NextFunction } from "express"
import { SignUpSchema } from "./signUp.schema"

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
	try {
        const {email, password, confirm_password} = SignUpSchema.parse(req.body)
         
        console.log(email, password, confirm_password)
	} catch (error) {
        console.log(error)
		return next(error)
	}
}
