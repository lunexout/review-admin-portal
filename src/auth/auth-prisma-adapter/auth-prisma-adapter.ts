/**
 * Auth.js integrations save sessions in a cookie by default. Therefore, setting up a database is optional. But we need to persist user information in our own database, as well as implement certain flows (e.g. password reset), so we need to use a Database Adapter.
 *
 * Information that persists beyond the users' session:
 * - Profile information (name, avatar, time zone, etc.)
 * - Roles and permissions
 * - User settings and preferences
 * - User-related business logic
 * - Metadata about the account (signup date, last login, etc.)
 *
 */
import { prisma } from '@/server/prisma'
import { PrismaAdapter as createPrismaDatabaseAdapter } from '@auth/prisma-adapter'

export const prismaDatabaseAdapter = createPrismaDatabaseAdapter(prisma)
