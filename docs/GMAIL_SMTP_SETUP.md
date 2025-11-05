# Gmail SMTP Setup Guide

## 🎯 Kenapa Gmail SMTP?

✅ **100% Gratis** - Tidak perlu bayar atau verify domain  
✅ **Simple Setup** - Hanya butuh Gmail account  
✅ **Reliable** - Infrastruktur Google yang stabil  
✅ **500 emails/day** - Cukup untuk aplikasi kecil-menengah  

## 📧 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. Buka [Google Account Security](https://myaccount.google.com/security)
2. Scroll ke **"2-Step Verification"**
3. Klik **"Get Started"** dan ikuti instruksi
4. Verifikasi dengan phone number

### Step 2: Generate App Password

1. Setelah 2FA aktif, buka [App Passwords](https://myaccount.google.com/apppasswords)
2. Login jika diminta
3. Di dropdown **"Select app"**, pilih **"Mail"**
4. Di dropdown **"Select device"**, pilih **"Other (Custom name)"**
5. Ketik: `Archinara PM`
6. Klik **"Generate"**
7. **COPY** 16-digit password yang muncul (contoh: `abcd efgh ijkl mnop`)

⚠️ **PENTING:** Password ini hanya muncul sekali! Simpan dengan aman.

### Step 3: Update Environment Variables

Buka file `.env` dan tambahkan/update:

```bash
# Gmail SMTP Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=khoirularyan123@gmail.com
EMAIL_SERVER_PASSWORD=abcd efgh ijkl mnop  # App Password dari Step 2
EMAIL_FROM=Archinara PM <khoirularyan123@gmail.com>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Ganti:**
- `EMAIL_SERVER_USER` dengan Gmail Anda
- `EMAIL_SERVER_PASSWORD` dengan App Password yang di-generate
- `EMAIL_FROM` dengan nama dan email Anda

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Test Email

```bash
npm run test:email
```

Jika berhasil, Anda akan melihat:
```
✅ Email sent successfully!
Message ID: <xxx@gmail.com>
```

## 🔧 Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Penyebab:** App Password salah atau 2FA belum aktif

**Solusi:**
1. Pastikan 2FA sudah aktif
2. Generate App Password baru
3. Copy-paste dengan benar (termasuk spasi)

### Error: "Connection timeout"

**Penyebab:** Firewall atau network issue

**Solusi:**
1. Cek koneksi internet
2. Pastikan port 587 tidak diblok
3. Coba ganti `EMAIL_SERVER_PORT` ke `465` dan set `secure: true`

### Email masuk ke Spam

**Solusi:**
1. Tambahkan sender ke contacts
2. Mark as "Not Spam"
3. Untuk production, pertimbangkan verify domain dengan SPF/DKIM

## 📊 Gmail Limits

| Limit | Value |
|-------|-------|
| Emails per day | 500 |
| Recipients per email | 500 |
| Attachment size | 25 MB |

Untuk aplikasi yang lebih besar, pertimbangkan:
- **SendGrid** (100 emails/day gratis)
- **Mailgun** (5,000 emails/month gratis)
- **Amazon SES** (62,000 emails/month gratis dengan AWS Free Tier)

## 🎨 Email Templates

Template HTML sudah siap di `src/lib/email.ts`:
- ✅ Verification Email
- ✅ Password Reset Email

Keduanya responsive dan modern!

## 🚀 Production Checklist

- [ ] 2FA enabled di Gmail account
- [ ] App Password generated
- [ ] `.env` updated dengan credentials
- [ ] Test email berhasil
- [ ] Email tidak masuk spam
- [ ] Monitoring email quota (500/day)

## 📚 Resources

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/)
