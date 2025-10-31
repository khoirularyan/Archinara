# Tech Stack - Archinara

Dokumentasi lengkap teknologi yang digunakan dalam project ini.

---

## 🎯 **Core Framework**

### **Next.js 16.0.0**
- **Apa itu?** React framework untuk production
- **Kenapa?** 
  - Server-side rendering (SSR)
  - App Router (routing modern)
  - API Routes (backend built-in)
  - Optimized performance
- **Docs:** https://nextjs.org

### **React 19.2.0**
- **Apa itu?** Library untuk build UI
- **Kenapa?** 
  - Component-based
  - Virtual DOM (cepat)
  - Reusable components
- **Docs:** https://react.dev

### **TypeScript 5**
- **Apa itu?** JavaScript dengan type safety
- **Kenapa?**
  - Catch errors saat coding
  - Better autocomplete
  - Lebih maintainable
- **Docs:** https://www.typescriptlang.org

---

## 🎨 **Styling**

### **Tailwind CSS 4**
- **Apa itu?** Utility-first CSS framework
- **Kenapa?**
  - Cepat styling tanpa CSS file
  - Responsive built-in
  - Modern design
- **Contoh:**
  ```tsx
  <div className="bg-blue-500 text-white p-4 rounded-lg">
    Hello World
  </div>
  ```
- **Docs:** https://tailwindcss.com

### **shadcn/ui**
- **Apa itu?** Collection of reusable components
- **Kenapa?**
  - Copy-paste components
  - Customizable
  - Accessible (ARIA)
- **Components:** Button, Card, Dialog, dll
- **Docs:** https://ui.shadcn.com

### **Lucide React**
- **Apa itu?** Icon library
- **Kenapa?** 
  - 1000+ icons
  - Lightweight
  - Customizable
- **Docs:** https://lucide.dev

---

## 📦 **Package Manager**

### **pnpm**
- **Apa itu?** Fast, disk space efficient package manager
- **Kenapa?**
  - 3x lebih cepat dari npm
  - Hemat disk space
  - Strict dependencies
- **Commands:**
  ```bash
  pnpm install        # Install dependencies
  pnpm add <package>  # Add package
  pnpm remove <pkg>   # Remove package
  pnpm dev            # Run dev server
  ```
- **Docs:** https://pnpm.io

**⚠️ PENTING:** Jangan campur npm dan pnpm! Pilih salah satu.

---

## 🗄️ **Database (Akan Disetup)**

### **Prisma**
- **Apa itu?** Modern ORM (Object-Relational Mapping)
- **Kenapa?**
  - Type-safe database queries
  - Auto-completion
  - Migration system
  - Prisma Studio (GUI)
- **Docs:** https://www.prisma.io

### **PostgreSQL**
- **Apa itu?** Relational database
- **Kenapa?**
  - Production-ready
  - ACID compliant
  - Scalable
- **Alternative:** SQLite (untuk development)
- **Docs:** https://www.postgresql.org

### **bcrypt**
- **Apa itu?** Library untuk hash password
- **Kenapa?**
  - Secure password storage
  - Industry standard
- **Docs:** https://www.npmjs.com/package/bcrypt

---

## 🧩 **Utility Libraries**

### **clsx** + **tailwind-merge**
- **Apa itu?** Utility untuk merge CSS classes
- **Kenapa?** Avoid Tailwind conflicts
- **Contoh:**
  ```tsx
  cn("bg-blue-500", isActive && "bg-red-500")
  // Result: "bg-red-500" (no conflict)
  ```

### **class-variance-authority (CVA)**
- **Apa itu?** Create variant-based components
- **Kenapa?** Type-safe component variants
- **Contoh:**
  ```tsx
  <Button variant="primary" size="lg">Click</Button>
  ```

### **Sonner**
- **Apa itu?** Toast notification library
- **Kenapa?**
  - Beautiful notifications
  - Easy to use
- **Contoh:**
  ```tsx
  toast.success("Login berhasil!")
  ```

---

## 🔧 **Development Tools**

### **ESLint**
- **Apa itu?** JavaScript linter
- **Kenapa?** Catch code quality issues

### **PostCSS**
- **Apa itu?** CSS processor
- **Kenapa?** Transform CSS (untuk Tailwind)

---

## 📊 **Project Structure**

```
Tech Stack Flow:

User Browser
    ↓
Next.js 16 (React 19)
    ↓
TypeScript
    ↓
Tailwind CSS + shadcn/ui
    ↓
API Routes
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

---

## 🚀 **Commands Cheat Sheet**

### Development
```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Package Management
```bash
pnpm install      # Install all dependencies
pnpm add <pkg>    # Add new package
pnpm remove <pkg> # Remove package
pnpm update       # Update packages
```

### Database (Setelah setup Prisma)
```bash
npx prisma init           # Initialize Prisma
npx prisma generate       # Generate Prisma Client
npx prisma migrate dev    # Run migration
npx prisma studio         # Open database GUI
npx prisma db push        # Push schema to DB
```

---

## 📚 **Learning Resources**

### Beginner
1. **Next.js Tutorial:** https://nextjs.org/learn
2. **React Docs:** https://react.dev/learn
3. **Tailwind CSS:** https://tailwindcss.com/docs

### Intermediate
1. **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/
2. **Prisma Getting Started:** https://www.prisma.io/docs/getting-started
3. **shadcn/ui Components:** https://ui.shadcn.com/docs

### Advanced
1. **Next.js App Router:** https://nextjs.org/docs/app
2. **Prisma Best Practices:** https://www.prisma.io/docs/guides
3. **PostgreSQL Tutorial:** https://www.postgresql.org/docs/

---

## 🎓 **Why This Stack?**

### **Modern & Production-Ready**
- Next.js 16 = Latest features
- React 19 = Cutting edge
- TypeScript = Type safety
- Prisma = Modern ORM

### **Developer Experience**
- Fast development (pnpm + Turbopack)
- Type safety (TypeScript)
- Auto-completion (Prisma)
- Beautiful UI (Tailwind + shadcn/ui)

### **Performance**
- Server-side rendering (Next.js)
- Optimized builds
- Fast database queries (Prisma)

### **Scalability**
- Component-based (React)
- Route groups (Next.js)
- Database migrations (Prisma)
- PostgreSQL (production-ready)

---

## 🔄 **Version Info**

| Package | Version | Latest |
|---------|---------|--------|
| Next.js | 16.0.0 | ✅ Latest |
| React | 19.2.0 | ✅ Latest |
| TypeScript | 5.x | ✅ Latest |
| Tailwind CSS | 4.x | ✅ Latest |
| pnpm | - | Use latest |

---

## 🆚 **Alternatives (Why Not?)**

### **npm vs pnpm**
- npm: Slower, more disk space
- **pnpm**: ✅ Faster, efficient

### **Vite vs Next.js**
- Vite: Client-side only
- **Next.js**: ✅ SSR, API routes, routing

### **Styled Components vs Tailwind**
- Styled Components: Runtime CSS
- **Tailwind**: ✅ Build-time, smaller bundle

### **MongoDB vs PostgreSQL**
- MongoDB: NoSQL, less structure
- **PostgreSQL**: ✅ Relational, ACID

---

**Kesimpulan:** Stack ini adalah kombinasi teknologi modern yang production-ready dan developer-friendly! 🚀
