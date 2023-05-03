import z from "zod"

const SignUpSchema = z.object({
	email: z.string(),
	password: z.string(),
	confirm_password: z.string(),
})

export type SignUpSchema = z.infer<typeof SignUpSchema>