import {PrismaClient, Role} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    const testUser = await prisma.user.upsert({
        where: {email: 'test@test.com'},
        update: {},
        create: {
            email: 'test@test.com',
            hashedPassword: bcrypt.hashSync("123456", bcrypt.genSaltSync())
        }
    })

    const testAdmin = await prisma.user.upsert({
        where: {email: 'admin@test.com'},
        update: {},
        create: {
            email: 'admin@test.com',
            hashedPassword: bcrypt.hashSync("123456", bcrypt.genSaltSync()),
            role: Role.ADMIN
        }
    })

    console.log(testUser)
    console.log(testAdmin)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })