import { NextFunction, Request, Response } from "express"
import { findAccountById, findAllAccounts } from "./account.model"
import { ErrorWithStatusCode } from "../classes/ErrorWithStatusCode"

export const getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accounts = await findAllAccounts()

		return res.status(200).json({ statusCode: 200, data: accounts })
	} catch (error) {
		return next(error)
	}
}

export const getAccountById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accountId = req.params.id ?? null
		const account = await findAccountById(accountId)

		if (!account) {
			throw new ErrorWithStatusCode(404, "Account is not found.")
		}

		return res.status(200).json({ statusCode: 200, data: account })
	} catch (error) {
		return next(error)
	}
}

