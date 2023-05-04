import { PrismaClient, User } from "@prisma/client"
const prisma = new PrismaClient()

export const createNewUser = (data: User) => prisma.user.create({ data })
