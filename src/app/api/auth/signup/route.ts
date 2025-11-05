import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours

    // Create user with verification token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Not verified yet
        resetToken: verificationToken, // Reuse resetToken field for verification
        resetTokenExpiry: tokenExpiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name, verificationToken);
      console.log('[Signup] Verification email sent to:', email);
    } catch (emailError) {
      console.error('[Signup] Failed to send verification email:', emailError);
      // Don't fail signup if email fails
    }

    return NextResponse.json(
      {
        message: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.',
        user,
        requiresVerification: true
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran' },
      { status: 500 }
    );
  }
}
