import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Hash password
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Cek apakah user sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@archinara.local' }
  })

  if (existingUser) {
    console.log('✅ User admin@archinara.local sudah ada')
    console.log('🔄 Update password...')
    
    await prisma.user.update({
      where: { email: 'admin@archinara.local' },
      data: { password: hashedPassword }
    })
    
    console.log('✅ Password updated!')
  } else {
    console.log('📝 Membuat user baru...')
    
    await prisma.user.create({
      data: {
        email: 'admin@archinara.local',
        name: 'Admin Archinara',
        password: hashedPassword,
        role: 'ADMIN',
      }
    })
    
    console.log('✅ User created!')
  }

  console.log('\n' + '='.repeat(50))
  console.log('📋 LOGIN CREDENTIALS')
  console.log('='.repeat(50))
  console.log('Email:    admin@archinara.local')
  console.log('Password: 123456')
  console.log('Role:     ADMIN')
  console.log('='.repeat(50))
  console.log('\n🌐 Login URL: http://localhost:3000/auth/login\n')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
