# 📧 Setup Email dengan Gmail SMTP

## ✅ Migration Complete: Resend → Gmail SMTP

Aplikasi sekarang menggunakan **Gmail SMTP** dengan **Nodemailer** untuk email verification.

### Kenapa Gmail SMTP?
- ✅ **100% Gratis** - Tidak perlu verify domain
- ✅ **Simple Setup** - Hanya butuh Gmail account + App Password
- ✅ **Reliable** - Infrastruktur Google
- ✅ **500 emails/day** - Cukup untuk development & production kecil

---

## 🚀 Quick Start (5 Menit)

### Step 1: Enable 2-Factor Authentication

1. Buka: https://myaccount.google.com/security
2. Scroll ke **"2-Step Verification"**
3. Klik **"Get Started"** dan ikuti instruksi
4. Verifikasi dengan phone number

### Step 2: Generate App Password

1. Buka: https://myaccount.google.com/apppasswords
2. Login jika diminta
3. Di dropdown **"Select app"** → pilih **"Mail"**
4. Di dropdown **"Select device"** → pilih **"Other (Custom name)"**
5. Ketik: `Archinara PM`
6. Klik **"Generate"**
7. **COPY** 16-digit password (contoh: `abcd efgh ijkl mnop`)

⚠️ **PENTING:** Password ini hanya muncul sekali!

### Step 3: Update File `.env`

Buka file `.env` di root project dan tambahkan/update:

```bash
# Gmail SMTP Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=khoirularyan123@gmail.com
EMAIL_SERVER_PASSWORD=xxxx xxxx xxxx xxxx  # Paste App Password dari Step 2
EMAIL_FROM=Archinara PM <khoirularyan123@gmail.com>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Ganti:**
- `EMAIL_SERVER_USER` → Gmail Anda
- `EMAIL_SERVER_PASSWORD` → App Password yang baru di-generate
- `EMAIL_FROM` → Nama dan email Anda

### Step 4: Test Email

```bash
npm run test:email
```

**Expected Output:**
```
🧪 Testing Gmail SMTP Configuration

1️⃣ Testing Gmail SMTP connection...
✅ Gmail SMTP connection successful!

2️⃣ Sending test verification email...
✅ Test email sent to: khoirularyan123@gmail.com

📧 Email Details:
  To: khoirularyan123@gmail.com
  Subject: ✅ Verifikasi Email Anda - Archinara PM
  
✅ All tests passed!
```

Cek inbox Anda (termasuk folder spam)!

---

## 🔧 Troubleshooting

### ❌ Error: "Invalid login: 535-5.7.8"

**Penyebab:** App Password salah atau 2FA belum aktif

**Solusi:**
1. Pastikan 2FA sudah aktif di Gmail
2. Generate App Password baru
3. Copy-paste dengan benar (termasuk spasi OK)
4. Update `.env` dan restart dev server

### ❌ Error: "Connection timeout"

**Penyebab:** Firewall atau network issue

**Solusi:**
1. Cek koneksi internet
2. Pastikan port 587 tidak diblok firewall
3. Coba ganti ke port 465:
   ```bash
   EMAIL_SERVER_PORT=465
   ```

### ❌ Email masuk ke Spam

**Solusi:**
1. Mark email sebagai "Not Spam"
2. Tambahkan sender ke contacts
3. Untuk production, pertimbangkan SPF/DKIM setup

### ❌ Error: "Cannot find module 'nodemailer'"

**Solusi:**
```bash
npm install
```

---

## 📊 Gmail Limits

| Limit | Value |
|-------|-------|
| Emails per day | 500 |
| Recipients per email | 500 |
| Attachment size | 25 MB |

**Untuk aplikasi lebih besar:**
- SendGrid (100 emails/day gratis)
- Mailgun (5,000 emails/month gratis)
- Amazon SES (62,000 emails/month gratis)

---

## 📝 Files Yang Sudah Diupdate

✅ `package.json` - Nodemailer installed, Resend removed  
✅ `src/lib/email.ts` - Gmail SMTP transporter  
✅ `src/app/api/auth/signup/route.ts` - Pakai Nodemailer  
✅ `src/app/api/auth/resend-verification/route.ts` - Pakai Nodemailer  
✅ `src/app/api/auth/forgot-password/route.ts` - Pakai Nodemailer  
✅ `scripts/test-email.ts` - Test script untuk Gmail  

---

## 🎨 Email Templates

Template HTML sudah siap dan responsive:
- ✅ **Verification Email** - Dikirim saat signup
- ✅ **Password Reset Email** - Dikirim saat forgot password

Keduanya menggunakan gradient purple-blue yang modern!

---

## 📚 Resources

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Nodemailer Docs](https://nodemailer.com/)
- [Gmail SMTP Setup Guide](docs/GMAIL_SMTP_SETUP.md) - Detailed guide

---

## ✅ Production Checklist

- [ ] 2FA enabled di Gmail account
- [ ] App Password generated
- [ ] `.env` updated dengan credentials yang benar
- [ ] Test email berhasil (`npm run test:email`)
- [ ] Email tidak masuk spam
- [ ] Monitoring email quota (max 500/day)

---

**Need Help?** Lihat dokumentasi lengkap di `docs/GMAIL_SMTP_SETUP.md`
