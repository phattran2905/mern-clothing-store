import { NextFunction, Request, Response } from "express"
import bcrypt from "bcrypt"
import {
	createAccount,
	deleteAccountById,
	findAccountById,
	findAllAccounts,
	updateAccountStatus,
} from "./account.model"
import { ErrorWithStatusCode } from "../classes/ErrorWithStatusCode"
import { Role, Status } from "@prisma/client"
import { CreateAccountForm } from "./account.schema"
import { ValidationError } from "../classes/ValidationError"

export const createNewAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await CreateAccountForm.safeParseAsync(req.body)
		if (!validation.success) {
			throw new ValidationError(400, validation.error)
		}

		const hashedPassword = bcrypt.hashSync(validation.data.password, bcrypt.genSaltSync(12))

		const newAccountData: { email: string; hashedPassword: string; role?: Role } = {
			email: validation.data.email,
			hashedPassword,
		}

		if (validation.data.role) {
			newAccountData.role =
				validation.data.role.toUpperCase() === Role.ADMIN ? Role.ADMIN : Role.USER
		}

		const newAccount = await createAccount(newAccountData)
		if (!newAccount) {
			throw new ErrorWithStatusCode(500, `Failed to create new account.`)
		}

		return res.status(201).json({ statusCode: 201, data: newAccount })
	} catch (error) {
		return next(error)
	}
}

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

export const removeAccountById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentAdmin = res.locals.user
		const accountId = req.params.id ?? null

		if (currentAdmin.id === accountId) {
			throw new ErrorWithStatusCode(400, `Can not self delete your logging account.`)
		}

		const account = await findAccountById(accountId)
		if (!account) {
			throw new ErrorWithStatusCode(404, "Account is not found.")
		}

		const deletedAccount = await deleteAccountById(accountId)
		if (!deletedAccount) {
			throw new ErrorWithStatusCode(500, `Failed to delete the account with id ${accountId}`)
		}

		return res.status(200).json({ statusCode: 200, message: "Removed." })
	} catch (error) {
		return next(error)
	}
}

export const updateAccountStatusById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const currentAdmin = res.locals.user
		const accountId = req.params.id ?? null
		const status = req.query.status ?? null

		if (currentAdmin.id === accountId) {
			throw new ErrorWithStatusCode(400, `Can not self ban your logging account.`)
		}

		if (!status) {
			throw new ErrorWithStatusCode(400, `Can not change status to null`)
		}

		const account = await findAccountById(accountId)
		if (!account) {
			throw new ErrorWithStatusCode(404, "Account is not found.")
		}

		const newStatus =
			status.toString().toLowerCase() === "active" ? Status.ACTIVE : Status.INACTIVE
		const updated = await updateAccountStatus(accountId, newStatus)

		if (!updated) {
			throw new ErrorWithStatusCode(
				500,
				`Failed to update the account's status with id ${accountId}`
			)
		}

		return res.status(200).json({ statusCode: 200, message: "OK." })
	} catch (error) {
		console.log(error)
		return next(error)
	}
}
