interface IErrorWithStatusCode extends Error {
	statusCode?: number
}

class ErrorWithStatusCode extends Error implements IErrorWithStatusCode {
	statusCode?: number

	constructor(_statusCode: number, _message: string) {
		super()
		this.statusCode = _statusCode
		this.message = _message
	}
}

export { ErrorWithStatusCode, IErrorWithStatusCode }
