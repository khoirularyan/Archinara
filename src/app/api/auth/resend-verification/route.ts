import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email harus diisi' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email sudah terverifikasi' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: verificationToken,
        resetTokenExpiry: tokenExpiry,
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, user.name || 'User', verificationToken);
      console.log('[Resend Verification] Email sent to:', email);
    } catch (emailError) {
      console.error('[Resend Verification] Failed to send email:', emailError);
      return NextResponse.json(
        { error: 'Gagal mengirim email verifikasi' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Email verifikasi berhasil dikirim ulang. Silakan cek inbox Anda.',
        sent: true,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Resend Verification] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim ulang email' },
      { status: 500 }
    );
  }
}
