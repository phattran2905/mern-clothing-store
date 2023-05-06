import z from "zod"
import { findUserByEmail, findUserByResetPasswordToken } from "./auth.model"

// LoginForm
const LoginForm = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
		password: z.string().min(6),
	})
	.superRefine(async (data, ctx) => {
		// Check existing email
		const existingEmail = await findUserByEmail(data.email)
		if (!existingEmail) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Email does not exist.`,
				path: ["email"],
				fatal: true,
			})

			return z.NEVER
		}
	})
type LoginForm = z.infer<typeof LoginForm>

// SignUpForm
const SignUpForm = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
		password: z.string().min(6),
		confirm: z.string().min(6),
	})
	.superRefine(async (data, ctx) => {
		if (data.password !== data.confirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Password don't match",
				path: ["password", "confirm"],
				fatal: true,
			})

			return z.NEVER
		}

		const existingEmail = await findUserByEmail(data.email)
		if (existingEmail) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Email already exists.`,
				path: ["email"],
			})
		}
	})
type SignUpForm = z.infer<typeof SignUpForm>

// RequestResetPasswordForm
const RequestResetPasswordForm = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
	})
	.superRefine(async (data, ctx) => {
		// Check existing email
		const existingEmail = await findUserByEmail(data.email)
		if (!existingEmail) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Email does not exist.`,
				path: ["email"],
				fatal: true,
			})

			return z.NEVER
		}
	})
type RequestResetPasswordForm = z.infer<typeof RequestResetPasswordForm>

// SendResetPasswordForm
const SendResetPasswordEmailForm = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
		resetPasswordToken: z.string(),
		callbackURL: z.string().url(),
	})
	.superRefine(async (data, ctx) => {
		const existingToken = await findUserByEmail(data.email)
		if (!existingToken) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Email does not exist.`,
				path: ["email"],
				fatal: true,
			})
			return z.NEVER
		}

		if (
			!existingToken.resetPasswordToken ||
			data.resetPasswordToken !== existingToken.resetPasswordToken
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Reset password token does not exist.`,
				path: ["resetPasswordToken"],
			})
		}
	})
type SendResetPasswordEmailForm = z.infer<typeof SendResetPasswordEmailForm>

// ResetPasswordForm
const ResetPasswordForm = z
	.object({
		resetPasswordToken: z.string(),
		password: z.string().min(6),
		confirm: z.string().min(6),
	})
	.superRefine(async (data, ctx) => {
		if (data.password !== data.confirm) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Password don't match",
				path: ["password", "confirm"],
				fatal: true,
			})
			return z.NEVER
		}

		const existingToken = await findUserByResetPasswordToken(data.resetPasswordToken)
		if (!existingToken) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Reset password token does not exist.`,
				path: ["resetPasswordToken"],
			})
		}
	})
type ResetPasswordForm = z.infer<typeof ResetPasswordForm>

export {
	LoginForm,
	SignUpForm,
	RequestResetPasswordForm,
	ResetPasswordForm,
	SendResetPasswordEmailForm,
}
