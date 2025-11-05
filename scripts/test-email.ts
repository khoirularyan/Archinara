import 'dotenv/config'
import { testEmailConnection, sendVerificationEmail } from '../src/lib/email'

async function main() {
  console.log('🧪 Testing Gmail SMTP Configuration\n')
  console.log('================================\n')

  // Test 1: Check SMTP Connection
  console.log('1️⃣ Testing Gmail SMTP connection...')
  const isConnected = await testEmailConnection()
  
  if (!isConnected) {
    console.log('❌ Gmail SMTP connection failed!\n')
    console.log('Please check:')
    console.log('  - EMAIL_SERVER_USER is set in .env')
    console.log('  - EMAIL_SERVER_PASSWORD is set in .env (use App Password)')
    console.log('  - 2FA is enabled on your Gmail account')
    console.log('\nSee docs/GMAIL_SMTP_SETUP.md for setup guide')
    process.exit(1)
  }

  console.log('✅ Gmail SMTP connection successful!\n')

  // Test 2: Send Test Email
  console.log('2️⃣ Sending test verification email...')
  
  const testEmail = process.env.EMAIL_SERVER_USER || 'test@example.com'
  const testName = 'Test User'
  const testToken = 'test-token-' + Date.now()

  try {
    await sendVerificationEmail(testEmail, testName, testToken)
    console.log(`✅ Test email sent to: ${testEmail}\n`)
    
    console.log('📧 Email Details:')
    console.log(`  To: ${testEmail}`)
    console.log(`  Subject: ✅ Verifikasi Email Anda - Archinara PM`)
    console.log(`  Verification URL: ${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${testToken}\n`)
    
    console.log('✅ All tests passed!')
    console.log('\n💡 Next steps:')
    console.log('  1. Check your inbox (and spam folder)')
    console.log('  2. Verify the email looks good')
    console.log('  3. Test the verification link')
    console.log('  4. Ready for production! 🚀')
  } catch (error) {
    console.log('❌ Failed to send test email')
    console.error('Error:', error)
    console.log('\nTroubleshooting:')
    console.log('  - Check your Gmail App Password is correct')
    console.log('  - Make sure 2FA is enabled')
    console.log('  - See docs/GMAIL_SMTP_SETUP.md for help')
    process.exit(1)
  }
}

main().catch(console.error)
