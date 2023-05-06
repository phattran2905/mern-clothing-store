import { NextFunction, Request, Response } from "express"
import { findAllAccounts } from "./account.model"

export const getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accounts = await findAllAccounts()

		return res.status(200).json({ statusCode: 200, data: accounts })
	} catch (error) {
		return next(error)
	}
}
