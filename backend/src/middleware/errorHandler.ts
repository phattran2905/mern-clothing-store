import { NextFunction, Response, Request } from "express"
import { IErrorWithStatusCode } from "../classes/ErrorWithStatusCode"
import { IValidationError, ValidationError } from "../classes/ValidationError"

export const errorHandler = (
	err: IErrorWithStatusCode | IValidationError<any>,
	req: Request,
	res: Response,
	next: NextFunction // REQUIRED
) => {
	const statusCode = err.statusCode ?? 500
	const message = !err.statusCode ? "Internal Server Error" : err.message

	if (err instanceof ValidationError) {
		return res.status(statusCode).json({ statusCode, message, errors: err.errors.issues })
	}

	return res.status(statusCode).json({ statusCode, message })
}
