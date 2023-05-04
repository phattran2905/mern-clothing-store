import z from "zod"
import { findUserByEmail } from "../authentication/auth.model"

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

            return z.NEVER;
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

export default SignUpForm
