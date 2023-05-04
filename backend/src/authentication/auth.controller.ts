import { Response, Request, NextFunction } from "express"
import bcrypt from "bcrypt"
import { findUserByEmail, findUserById, updateUserById } from "./auth.model"
import { AuthBody } from "./auth.types"
import jsonwebtoken from "jsonwebtoken"
import crypto from "crypto"
import { ErrorWithStatusCode } from "../classes/ErrorWithStatusCode"

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password }: AuthBody = req.body
		if (!email || !password) {
			throw new ErrorWithStatusCode(400, "Email and password are required.")
		}

		const user = await findUserByEmail(email)
		// Not existent
		if (!user) {
			throw new ErrorWithStatusCode(404, "Email does not exist.")
		}
		// Check password
		const correctPassword = bcrypt.compareSync(password, user.hashedPassword!)

		if (!correctPassword) {
			throw new ErrorWithStatusCode(401, "Password is not correct.")
		}

		// Generate JsonWebToken
		const secretKey = process.env.JWT_SECRET ?? crypto.randomBytes(16).toString("base64url")
		const jsonWebToken = jsonwebtoken.sign({ id: user.id }, secretKey)

		const updated = await updateUserById(user.id, { jsonWebToken })

		return res.status(200).json(updated)
	} catch (error) {
		return next(error)
	}
}
