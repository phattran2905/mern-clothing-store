import { ZodError } from "zod"

interface IValidationError<T> extends Error{
	statusCode: number
	errors: ZodError<T>
	message: string
}

class ValidationError<T> extends Error implements IValidationError<T>{
	statusCode: number
	errors: ZodError<T>
	message: string

	constructor(_statusCode: number, _errors: ZodError<T>) {
		super()
		this.statusCode = _statusCode
		this.errors = _errors
		this.message = "Invalid inputs."
	}
}

export { ValidationError, IValidationError }
