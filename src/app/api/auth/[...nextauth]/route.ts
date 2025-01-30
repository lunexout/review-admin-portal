import { nextAuth } from '@/auth/auth'

// // NextAuth configuration

// TODO: Do something with this
// Prisma doesn't support edge runtime by default (yet, but they're working on it).
// If you enable this, it will throw an error "PrismaClient is not configured to run in Vercel Edge Functions or Edge Middleware."
// So we're running all auth-related functionality on Serverless, while only middleware is running on Edge.
// export const runtime = "edge"

export { nextAuth as GET, nextAuth as POST }
