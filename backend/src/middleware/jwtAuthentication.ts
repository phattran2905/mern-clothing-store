import { NextFunction, Request, Response } from "express"
import jsonwebtoken, { JsonWebTokenError, JwtPayload } from "jsonwebtoken"
import { findUserById } from "../authentication/auth.model"

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
	const headerString: string | undefined = req.headers["authorization"]
	if (!headerString) {
		return res.status(401).json({ statusCode: 401, message: "Unauthorized" })
	}

	const token: string[] = headerString.split("Bearer ")
	if (token.length < 2) {
		return res.status(401).json({ statusCode: 401, message: "Invalid bearer token." })
	}

	try {
		const jwtToken: string = token[1]
		const decodedPayload = jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET!) as {
			id: string
			iat: number
		}

		if (decodedPayload) {
			res.locals.user = await findUserById(decodedPayload.id)
		}

		return next()
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return res.status(400).json({
				statusCode: 400,
				message: error.message,
			})
		}

		return res.status(500).json({
			statusCode: 500,
			message: "Internal Server Error.",
		})
	}
}
