import { NextFunction, Response, Request } from "express"

interface CustomError extends Error {
	statusCode: number
}

export const errorHandler = async (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = err.statusCode ?? 500
	const message = err.statusCode ?? "Internal Server Error"

	return res.status(statusCode).json({ statusCode, message })
}
