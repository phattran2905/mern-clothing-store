import { PrismaClient, User } from "@prisma/client"
const prisma = new PrismaClient()

export const createNewUser = ({
	email,
	hashedPassword,
}: {
	email: string
	hashedPassword: string
}) =>
	prisma.user.create({
		data: {
			email,
			hashedPassword,
		},
	})
