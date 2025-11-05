import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validasi input
    if (!email) {
      return NextResponse.json({ error: "Email harus diisi" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "Jika email terdaftar, link reset password akan dikirim" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email using Resend
    try {
      await sendPasswordResetEmail(email, user.name || 'User', resetToken);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { error: "Gagal mengirim email reset password" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Link reset password telah dikirim ke email Anda" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan" },
      { status: 500 }
    );
  }
}
