import nodemailer from 'nodemailer'

const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com'
const EMAIL_SERVER_PORT = parseInt(process.env.EMAIL_SERVER_PORT || '587')
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER || ''
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD || ''
const EMAIL_FROM = process.env.EMAIL_FROM || 'Archinara PM <noreply@archinara.tech>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
  console.warn('[Email] Warning: Gmail SMTP credentials not set. Email sending will fail.')
  console.warn('[Email] Please set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD in .env')
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_SERVER_HOST,
  port: EMAIL_SERVER_PORT,
  secure: EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_SERVER_USER,
    pass: EMAIL_SERVER_PASSWORD,
  },
})

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Email - Archinara</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                Archinara PM
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Architecture Project Management
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                Halo, ${name}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Terima kasih telah mendaftar di <strong>Archinara PM</strong>. 
                Untuk melanjutkan, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Verifikasi Email Saya
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Atau salin dan tempel link berikut ke browser Anda:
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; margin: 20px 0;">
                <a href="${verificationUrl}" style="color: #667eea; text-decoration: none; word-break: break-all; font-size: 14px;">
                  ${verificationUrl}
                </a>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                <strong>Catatan:</strong> Link verifikasi ini akan kadaluarsa dalam <strong>24 jam</strong>. 
                Jika Anda tidak mendaftar di Archinara PM, abaikan email ini.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #999999; font-size: 13px;">
                © ${new Date().getFullYear()} Archinara PM. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Email ini dikirim otomatis, mohon tidak membalas.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const textContent = `
Halo, ${name}!

Terima kasih telah mendaftar di Archinara PM.

Untuk melanjutkan, silakan verifikasi alamat email Anda dengan mengklik link berikut:
${verificationUrl}

Link verifikasi ini akan kadaluarsa dalam 24 jam.

Jika Anda tidak mendaftar di Archinara PM, abaikan email ini.

---
© ${new Date().getFullYear()} Archinara PM. All rights reserved.
  `

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: '✅ Verifikasi Email Anda - Archinara PM',
      html: htmlContent,
      text: textContent,
    })

    console.log('[Email] Verification email sent to:', email)
    console.log('[Email] Message ID:', info.messageId)
    console.log('[Email] Response:', info.response)
  } catch (error) {
    console.error('[Email] Failed to send verification email:', error)
    throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/pm/reset-password?token=${token}`

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - Archinara</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                🔐 Reset Password
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                Halo, ${name}!
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Kami menerima permintaan untuk mereset password akun Anda. 
                Klik tombol di bawah untuk membuat password baru:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Atau salin dan tempel link berikut ke browser Anda:
              </p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #f5576c; margin: 20px 0;">
                <a href="${resetUrl}" style="color: #f5576c; text-decoration: none; word-break: break-all; font-size: 14px;">
                  ${resetUrl}
                </a>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                <strong>Catatan:</strong> Link ini akan kadaluarsa dalam <strong>1 jam</strong>. 
                Jika Anda tidak meminta reset password, abaikan email ini.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #999999; font-size: 13px;">
                © ${new Date().getFullYear()} Archinara PM. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                Email ini dikirim otomatis, mohon tidak membalas.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  const textContent = `
Halo, ${name}!

Kami menerima permintaan untuk mereset password akun Anda.

Klik link berikut untuk membuat password baru:
${resetUrl}

Link ini akan kadaluarsa dalam 1 jam.

Jika Anda tidak meminta reset password, abaikan email ini.

---
© ${new Date().getFullYear()} Archinara PM. All rights reserved.
  `

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: '🔐 Reset Password - Archinara PM',
      html: htmlContent,
      text: textContent,
    })

    console.log('[Email] Password reset email sent to:', email)
    console.log('[Email] Message ID:', info.messageId)
    console.log('[Email] Response:', info.response)
  } catch (error) {
    console.error('[Email] Failed to send password reset email:', error)
    throw new Error(`Failed to send password reset email: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Test Gmail SMTP connection
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
      console.error('[Email] Gmail SMTP credentials not set')
      return false
    }
    
    // Verify SMTP connection
    await transporter.verify()
    console.log('[Email] Gmail SMTP connection verified ✅')
    return true
  } catch (error) {
    console.error('[Email] Gmail SMTP connection failed:', error)
    return false
  }
}
