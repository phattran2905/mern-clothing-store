import { Response, Request, NextFunction } from "express"
import bcrypt from "bcrypt"
import { createNewUser, findUserByEmail, updateJWT, updateUserById } from "./auth.model"
import {LoginForm, SignUpForm} from "./auth.schema"
import jsonwebtoken from "jsonwebtoken"
import crypto from "crypto"
import { ErrorWithStatusCode } from "../classes/ErrorWithStatusCode"
import { ValidationError } from "../classes/ValidationError"

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


export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await LoginForm.safeParseAsync(req.body)
		if (!validation.success) {
			throw new ValidationError<LoginForm>(400, validation.error)
		}

		const user = await findUserByEmail(validation.data.email)
		if (!user) {
			throw new ErrorWithStatusCode(404, "User is not found.")
		}
		// Check password
		const correctPassword = bcrypt.compareSync(validation.data.password, user.hashedPassword!)

		if (!correctPassword) {
			throw new ErrorWithStatusCode(401, "Password is not correct.")
		}

		// Generate new JsonWebToken
		const secretKey = process.env.JWT_SECRET ?? crypto.randomBytes(16).toString("base64url")
		const jsonWebToken = jsonwebtoken.sign({ id: user.id }, secretKey)

		const updated = await updateUserById(user.id, { jsonWebToken })

		return res.status(200).json(updated)
	} catch (error) {
		return next(error)
	}
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = res.locals.user ?? null
		if (user) {
			await updateJWT(user.id, null)
			return res.status(200).json({ statusCode: 200, message: "Logged out." })
		}

		throw new ErrorWithStatusCode(404, "User does not exist.")
	} catch (error) {
		return next(error)
	}
}
