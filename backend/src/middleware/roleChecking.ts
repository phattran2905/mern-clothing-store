import { Role, User } from "@prisma/client"
import { NextFunction, Request, Response } from "express"

export const isAdminRole = (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: User = res.locals.user ?? null

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User does not exist.",
            })
        }

        if (user.role !== Role.ADMIN) {
            return res.status(403).json({
                statusCode: 403,
                message: "Forbidden."
            })
        }

        return next()
	} catch (error) {
		return res.status(500).json({
			statusCode: 500,
			message: "Internal Server Error.",
		})
	}
}