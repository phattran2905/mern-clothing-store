import { NextFunction, Response, Request } from "express"
import { IErrorWithStatusCode } from "../classes/ErrorWithStatusCode"

export const errorHandler = (
	err: IErrorWithStatusCode,
	req: Request,
	res: Response,
    next: NextFunction //
) => {
	const statusCode = err.statusCode ?? 500
	const message = !err.statusCode ? "Internal Server Error" : err.message

	return res.status(statusCode).json({ statusCode, message })
}
