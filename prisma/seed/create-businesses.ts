import { predefinedRoles } from '@/auth/permissions'
import { prisma } from '@/server/prisma'
import { faker } from '@faker-js/faker'
import {
  BusinessPriceTier,
  BusinessService,
  BusinessSocialMediaType,
  BusinessType,
  UserStatus
} from '@prisma/client'
import { getRandomItem, getUniqueRandomItems } from './utils'

export const BUSINESS_TYPES = Object.values(BusinessType)
export const BUSINESS_SERVICES = Object.values(BusinessService)
export const PRICE_TIERS = Object.values(BusinessPriceTier)
export const SOCIAL_MEDIA_TYPES = Object.values(BusinessSocialMediaType)

export const ROLES = Object.values(predefinedRoles)
export const STATUSES = Object.values(UserStatus)

const generatedNames = new Set<string>()

function getUniqueName(): string {
  let name = faker.company.name() // Generate a name
  while (generatedNames.has(name)) {
    name = faker.company.name() // Regenerate if it already exists
  }
  generatedNames.add(name) // Add to the set to track it
  return name
}

async function main() {
  // Create 10-35 random businesses
  for (let i = 0; i < 5 + Math.floor(Math.random() * 6); i++) {
    const randomCountForServices =
      Math.floor(Math.random() * BUSINESS_SERVICES.length) + 1 // 1 to BUSINESS_SERVICES.length
    const randomCountForPriceTier =
      Math.floor(Math.random() * PRICE_TIERS.length) + 1

    const business = await prisma.business.create({
      data: {
        name: getUniqueName(),
        description: faker.lorem.paragraph(),
        types: getUniqueRandomItems(BUSINESS_TYPES, 1), // Dynamic enum value
        priceTier: getUniqueRandomItems(PRICE_TIERS, randomCountForPriceTier), // Dynamic enum value
        icon: faker.image.avatar(),
        banner: faker.image.urlPlaceholder(),
        contacts: [faker.phone.number()],
        socialMedia: {
          create: [
            {
              type: getRandomItem(SOCIAL_MEDIA_TYPES), // Dynamic enum value
              link: faker.internet.url()
            }
          ]
        },
        services: {
          set: getUniqueRandomItems(BUSINESS_SERVICES, randomCountForServices)
        },
        addresses: {
          create: {
            address: faker.location.streetAddress(),
            latitude: parseFloat(faker.location.latitude().toString()),
            longitude: parseFloat(faker.location.longitude().toString()),
            googleMapUrl: `https://maps.google.com/?q=${faker.location.latitude()},${faker.location.longitude()}`
          }
        },
        gallery: {
          create: [
            {
              image: faker.image.urlPicsumPhotos(),
              altText: faker.lorem.words(),
              caption: faker.lorem.sentence()
            },
            {
              image: faker.image.urlPicsumPhotos(),
              altText: faker.lorem.words(),
              caption: faker.lorem.sentence()
            },
            {
              image: faker.image.urlPicsumPhotos(),
              altText: faker.lorem.words(),
              caption: faker.lorem.sentence()
            },
            {
              image: faker.image.urlPicsumPhotos(),
              altText: faker.lorem.words(),
              caption: faker.lorem.sentence()
            },
            {
              image: faker.image.urlPicsumPhotos(),
              altText: faker.lorem.words(),
              caption: faker.lorem.sentence()
            },
            {
              image: faker.image.urlPicsumPhotos(),
              altText: faker.lorem.words(),
              caption: faker.lorem.sentence()
            }
          ]
        }
      }
    })
    console.log(`Created business: ${business.name}`)
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
