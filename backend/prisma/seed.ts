import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    const test = await prisma.user.upsert({
        where: {email: 'test@test.com'},
        update: {},
        create: {
            email: 'test@test.com',
            hashedPassword: bcrypt.hashSync("123", bcrypt.genSaltSync())
        }
    })

    console.log(test)
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