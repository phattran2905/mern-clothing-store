import z from "zod"
import bcrypt from "bcrypt"
import { findUserByEmail } from "./auth.model"

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

export default LoginForm
