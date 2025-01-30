import { predefinedRoles } from '@/auth/permissions'
import { prisma } from '@/server/prisma'
import { createId } from '@paralleldrive/cuid2'
import { UserStatus } from '@prisma/client'
import { range } from './utils'

async function main() {
  const adminRole = await prisma.role.findFirst({
    where: {
      name: predefinedRoles.Admin
    }
  })

  if (adminRole === null) {
    throw new Error('Admin role not found.')
  }

  await prisma.admin.deleteMany()
  await prisma.user.deleteMany({
    where: {
      admin: {
        isNot: null
      }
    }
  })

  const admins = [
    ...new Set([
      'lunexout@gmail.com' // Jano, developer
    ])
  ]

  const adminUserIds = range(0, admins.length - 1).map(() => createId())

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getUsernameFromEmail = (email: string) => {
    const username = email.split('@')[0]!
    if (username.includes('.')) {
      const [first, last] = username.split('.')
      return capitalizeFirstLetter(first!) + ' ' + capitalizeFirstLetter(last!)
    }
    return username
  }

  const userIds = await prisma.user.createManyAndReturn({
    data: adminUserIds.map((userId, index) => {
      const email = admins[index]!

      return {
        id: userId,
        roleId: adminRole.id,
        email,
        status: UserStatus.ACTIVE,
        name: getUsernameFromEmail(email),
        emailVerified: new Date()
      }
    }),
    select: {
      id: true
    }
  })

  // Only pass userId when creating the Admin record
  await prisma.admin.createMany({
    data: userIds.map(({ id }) => ({
      userId: id
    }))
  })
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
