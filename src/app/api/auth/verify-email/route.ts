import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token verifikasi tidak ditemukan' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Token belum expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { 
          message: 'Email sudah terverifikasi sebelumnya',
          alreadyVerified: true 
        },
        { status: 200 }
      );
    }

    // Update user: set emailVerified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log('[Verify Email] User verified:', user.email);

    return NextResponse.json(
      {
        message: 'Email berhasil diverifikasi! Silakan login.',
        verified: true,
        email: user.email,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Verify Email] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat verifikasi email' },
      { status: 500 }
    );
  }
}
