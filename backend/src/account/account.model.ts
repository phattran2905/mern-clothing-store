import { PrismaClient, Role, Status } from "@prisma/client"

const prisma = new PrismaClient()

export const findAllAccounts = () => prisma.user.findMany()

export const findAccountById = (id: string) => prisma.user.findUnique({ where: { id } })

export const createAccount = ({
	email,
	hashedPassword,
	role,
}: {
	email: string
	hashedPassword: string
	role?: Role
}) =>
	prisma.user.create({
		data: {
			email,
			hashedPassword,
			role,
		},
	})

export const updateAccountPassword = (id: string, newHashedPassword: string) =>
	prisma.user.update({
		where: {
			id,
		},
		data: {
			hashedPassword: newHashedPassword,
		},
	})

export const updateAccountRole = (id: string, newRole: Role) =>
	prisma.user.update({
		where: { id },
		data: { role: newRole },
	})

export const updateAccountStatus = (id: string, status: Status) =>
	prisma.user.update({ where: { id }, data: { status } })

export const deleteAccountById = (id: string) => prisma.user.delete({ where: { id } })
