import z from "zod"

export const SignUpSchema = z.object({
	email: z.string(),
	password: z.string(),
	confirm_password: z.string(),
})

type SignUpSchema = z.infer<typeof SignUpSchema>