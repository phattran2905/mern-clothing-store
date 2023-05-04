import { PrismaClient, User } from "@prisma/client"

const prisma = new PrismaClient()

export const findUserById = async (id: number) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	})

	return user
}

export const findUserByEmail = async (email: string) => {
    console.log(email)
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	})

	return user
}

export const updateUserById = async (id: number, data: object) => {
	const updatedUser = await prisma.user.update({
		where: {
			id,
		},
		data,
	})
    return updatedUser
}
