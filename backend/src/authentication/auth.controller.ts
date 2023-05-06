import { Response, Request, NextFunction } from "express"
import bcrypt from "bcrypt"
import {
	createNewUser,
	findUserByEmail,
	findUserByResetPasswordToken,
	updateJWT,
	updateResetPasswordToken,
	updateUserById,
} from "./auth.model"
import {
	LoginForm,
	RequestResetPasswordForm,
	ResetPasswordForm,
	SendResetPasswordEmailForm,
	SignUpForm,
} from "./auth.schema"
import jsonwebtoken from "jsonwebtoken"
import crypto from "crypto"
import { ErrorWithStatusCode } from "../classes/ErrorWithStatusCode"
import { ValidationError } from "../classes/ValidationError"
import { resetPasswordTemplate, transporter } from "../utils/nodemailer"
import { ENV_VARIABLES } from "../config/server"

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await SignUpForm.safeParseAsync(req.body)

		if (!validation.success) {
			throw new ValidationError<SignUpForm>(400, validation.error)
		}

		const { email, password }: SignUpForm = validation.data
		const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12))
		const newUser = await createNewUser({
			email,
			hashedPassword,
		})

		return res.status(201).json(newUser)
	} catch (error) {
		return next(error)
	}
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await LoginForm.safeParseAsync(req.body)
		if (!validation.success) {
			throw new ValidationError<LoginForm>(400, validation.error)
		}

		const user = await findUserByEmail(validation.data.email)
		if (!user) {
			throw new ErrorWithStatusCode(404, "User is not found.")
		}
		// Check password
		const correctPassword = bcrypt.compareSync(validation.data.password, user.hashedPassword!)

		if (!correctPassword) {
			throw new ErrorWithStatusCode(401, "Password is not correct.")
		}

		// Generate new JsonWebToken
		const secretKey = process.env.JWT_SECRET ?? crypto.randomBytes(16).toString("base64url")
		const jsonWebToken = jsonwebtoken.sign({ id: user.id }, secretKey)

		const updated = await updateUserById(user.id, { jsonWebToken })

		return res.status(200).json(updated)
	} catch (error) {
		return next(error)
	}
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = res.locals.user ?? null
		if (user) {
			await updateJWT(user.id, null)
			return res.status(200).json({ statusCode: 200, message: "Logged out." })
		}

		throw new ErrorWithStatusCode(404, "User does not exist.")
	} catch (error) {
		return next(error)
	}
}

export const requestForPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await RequestResetPasswordForm.safeParseAsync(req.body)
		if (!validation.success) {
			throw new ValidationError<RequestResetPasswordForm>(400, validation.error)
		}

		const user = await findUserByEmail(validation.data.email)
		if (!user) {
			throw new ErrorWithStatusCode(404, "User is not found.")
		}
		// Generate reset token
		const newResetToken = crypto.randomBytes(32).toString("base64url")
		const updatedUser = await updateResetPasswordToken(user.id, newResetToken)

		if (updatedUser) {
			return res
				.status(200)
				.json({ statusCode: 200, data: { resetPasswordToken: newResetToken } })
		}

		throw new ErrorWithStatusCode(500, "Failed to process your reset password request.")
	} catch (error) {
		return next(error)
	}
}

export const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await SendResetPasswordEmailForm.safeParseAsync(req.body)
		if (!validation.success) {
			throw new ValidationError<SendResetPasswordEmailForm>(400, validation.error)
		}

		const user = await findUserByEmail(validation.data.email)
		if (!user) {
			throw new ErrorWithStatusCode(404, "User is not found.")
		}

		// Send the reset password email
		const resetPasswordLink = `${validation.data.callbackURL}?token=${user.resetPasswordToken}`
		const template = resetPasswordTemplate(resetPasswordLink)
		const isSent = await transporter.sendMail({
			to: validation.data.email,
			subject: "Reset password",
			html: template,
		})

		if (isSent) {
			return res.status(200).json({ statusCode: 200, message: "Email was sent." })
		}

		throw new ErrorWithStatusCode(500, "Failed to send reset password email.")
	} catch (error) {
		return next(error)
	}
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = await ResetPasswordForm.safeParseAsync(req.body)
		if (!validation.success) {
			throw new ValidationError<ResetPasswordForm>(400, validation.error)
		}

		const user = await findUserByResetPasswordToken(validation.data.resetPasswordToken)
		if (!user) {
			throw new ErrorWithStatusCode(404, "User is not found.")
		}

		// Generate reset token
		const newHashedPassword = bcrypt.hashSync(validation.data.password, bcrypt.genSaltSync(12))
		const updated = await updateUserById(user.id, { hashedPassword: newHashedPassword })
		if (updated) {
			return res.status(200).json({ statusCode: 200, message: "Password was set." })
		}

		throw new ErrorWithStatusCode(500, "Failed to set new password.")
	} catch (error) {
		return next(error)
	}
}
