import { Response, Request, NextFunction } from "express"
import bcrypt from "bcrypt"
import { findUserByEmail, findUserById, updateUserById } from "./auth.model"
import { AuthBody } from "./auth.types"
import jsonwebtoken from "jsonwebtoken"
import crypto from "crypto"

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password }: AuthBody = req.body

		if (!email || !password) {
			return res
				.status(400)
				.json({ statusCode: 400, message: "Email and password are required." })
		}

		console.log(email, password)
		const user = await findUserByEmail(email)
		console.log(user)

		// Not existent
		if (!user) {
			return res.status(400).json({ statusCode: 400, message: "Email does not exist." })
		}

		// Check password
		const correctPassword = bcrypt.compareSync(password, user.hashedPassword!)

		if (!correctPassword) {
			return res.status(401).json({ statusCode: 401, message: "Password is not correct." })
		}

		// Generate JsonWebToken
		const secretKey = process.env.JWT_SECRET ?? crypto.randomBytes(16).toString("base64url")
		const jsonWebToken = jsonwebtoken.sign({ id: user.id }, secretKey)

		const updated = await updateUserById(user.id, { jsonWebToken })

		return res.status(200).json(updated)
	} catch (error) {
		console.log(error)
        return res.status(500).json({ statusCode: 500, message: "Internal server error." })
	}
}
