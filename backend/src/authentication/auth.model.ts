import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const findUserById = (id: string) =>
	prisma.user.findUnique({
		where: {
			id,
		},
	})

export const findUserByEmail = (email: string) =>
	prisma.user.findUnique({
		where: {
			email,
		},
	})

export const updateUserById = (id: string, data: object) =>
	prisma.user.update({
		where: {
			id,
		},
		data,
	})
