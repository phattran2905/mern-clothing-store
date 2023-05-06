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

export const findUserByResetPasswordToken = (resetPasswordToken: string) => prisma.user.findUnique({
    where: {
        resetPasswordToken,
    }
})

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

export const updateResetPasswordToken = (id: string, newToken: string | null) =>
	prisma.user.update({ where: { id }, data: { resetPasswordToken: newToken } })

export const updateJWT = (id: string, newJWT: string | null) =>
	prisma.user.update({ where: { id }, data: { jsonWebToken: newJWT } })

export const updateUserById = (id: string, data: object) =>
	prisma.user.update({
		where: {
			id,
		},
		data,
	})
