import { Response, Request, NextFunction } from "express"
import bcrypt from "bcrypt"
import SignUpForm from "./signUp.schema"
import { ValidationError } from "../classes/ValidationError"
import { createNewUser } from "./signUp.model"

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await SignUpForm.safeParseAsync(req.body)

		if (!validation.success) {
			throw new ValidationError<SignUpForm>(400, validation.error)
		}

		const { email, password }: SignUpForm = validation.data
		const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12))
		const newUser = await createNewUser({
			email,
			hashedPassword,
		})

		return res.status(201).json(newUser)
	} catch (error) {
		return next(error)
	}
}
