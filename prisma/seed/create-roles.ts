import { predefinedPermissions, predefinedRoles } from '@/auth/permissions'
import { prisma } from '@/server/prisma'

async function main() {
  for await (const roleName of Object.values(predefinedRoles)) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: { permissions: predefinedPermissions[roleName] },
      create: { name: roleName, permissions: predefinedPermissions[roleName] }
    })
  }
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
