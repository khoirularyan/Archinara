import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Ambil user dari database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        // Cek password dengan bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Return user dengan role dan image
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Simpan role dan image ke JWT token
      if (user) {
        token.id = user.id
        token.role = user.role
        token.image = user.image
      }
      
      // Update token saat session di-update (untuk profile update)
      if (trigger === 'update' && session) {
        token.name = session.name
        token.image = session.image
      }
      
      return token
    },
    async session({ session, token }) {
      // Tempelin role, id, dan image ke session.user
      if (session?.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as 'ADMIN' | 'MANAGER' | 'ARCHITECT' | 'USER'
        session.user.image = token.image as string | null
      }
      return session
    }
  }
}
