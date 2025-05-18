import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  try {
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        isActive: true
      }
    })
    
    console.log('Admin user created successfully:', admin)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 