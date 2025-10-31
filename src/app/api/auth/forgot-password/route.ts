import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

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

    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/pm/reset-password?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Password - Archinara PM",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Reset Password</h2>
            <p>Anda menerima email ini karena ada permintaan reset password untuk akun Archinara PM.</p>
            <p>Klik link di bawah untuk reset password Anda:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
            <p style="color: #6b7280; font-size: 14px;">Link ini akan kadaluarsa dalam 1 jam.</p>
            <p style="color: #6b7280; font-size: 14px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
          </div>
        `,
      });
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
