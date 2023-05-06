import z from "zod"
import { findUserByEmail } from "../authentication/auth.model"
import { Role } from "@prisma/client"

const CreateAccountForm = z
	.object({
		email: z.string().email({ message: "Invalid email format" }),
		password: z.string().min(6),
		confirm: z.string().min(6),
		role: z.string().optional(),
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

		if (
			data.role &&
			data.role.toUpperCase() !== Role.ADMIN &&
			data.role.toUpperCase() !== Role.USER
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `Role's value is invalid.`,
				path: ["role"],
			})
		}
	})

type CreateAccountForm = z.infer<typeof CreateAccountForm>

export { CreateAccountForm }
