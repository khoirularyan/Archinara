# Penjelasan Struktur Folder

Dokumentasi lengkap tentang fungsi setiap folder dan file dalam project Archinara.

---

## 📚 `/src/lib` - Library & Utilities

Folder ini berisi **fungsi-fungsi helper** dan **utility functions** yang digunakan di seluruh aplikasi.

### File:

#### `utils.ts`
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Fungsi:**
- `cn()` - Menggabungkan class CSS dengan smart merging
- Menghindari konflik class Tailwind CSS
- Contoh penggunaan:
  ```tsx
  <div className={cn("bg-blue-500", isActive && "bg-red-500")}>
  ```

#### `index.ts`
- Export semua utility functions agar mudah di-import
- Contoh: `import { cn } from "@/lib"`

**Kapan Menambah File di `/lib`:**
- Fungsi format tanggal/waktu
- Validasi form
- Konversi data
- API helpers
- Constants & configs

---

## 🎣 `/src/hooks` - Custom React Hooks

Folder ini berisi **custom React hooks** untuk logic yang reusable di berbagai component.

### File:

#### `useCarousel.ts` (89 baris)
**Fungsi:** Mengelola carousel/slider dengan fitur lengkap

**Fitur:**
- ✅ Auto-play setiap 5 detik
- ✅ Navigation dots (klik untuk pindah slide)
- ✅ Touch swipe support (mobile-friendly)
- ✅ Responsive (otomatis adjust saat resize)
- ✅ Smooth transitions

**Cara Pakai:**
```tsx
import { useCarousel } from "@/hooks";

function MyCarousel() {
  const carouselRef = useCarousel();
  
  return (
    <div ref={carouselRef}>
      <div className="carousel-content">
        <div>Slide 1</div>
        <div>Slide 2</div>
      </div>
    </div>
  );
}
```

#### `useScrollAnimations.ts` (50 baris)
**Fungsi:** Menambahkan animasi saat scroll (reveal on scroll)

**Fitur:**
- ✅ Intersection Observer - elemen muncul saat masuk viewport
- ✅ Parallax effect - gambar bergerak saat scroll
- ✅ Performance optimized (passive listeners)

**Cara Pakai:**
```tsx
import { useScrollAnimations } from "@/hooks";

function MyPage() {
  useScrollAnimations();
  
  return (
    <div className="animate-element opacity-0 translate-y-10">
      Content akan muncul saat di-scroll
    </div>
  );
}
```

#### `index.ts`
- Export semua hooks untuk import yang mudah

**Kapan Membuat Custom Hook:**
- Logic yang dipakai di banyak component
- State management yang kompleks
- Side effects (API calls, subscriptions)
- Browser API interactions (localStorage, geolocation)

---

## 🧩 `/src/components` - React Components

Folder ini berisi semua **React components** yang terorganisir berdasarkan fungsinya.

### Struktur:

```
components/
├── layout/          # Layout components (Header, Footer, dll)
├── sections/        # Section components untuk homepage
├── ui/              # UI components dari shadcn/ui
├── ClientToaster.tsx
└── HomePage.tsx
```

---

### 📐 `/components/layout` - Layout Components

Component yang digunakan untuk **struktur layout** halaman.

#### Files:
- **`Header.tsx`** - Navigation bar untuk marketing site
- **`Footer.tsx`** - Footer untuk marketing site
- **`PMHeader.tsx`** - Navigation bar khusus untuk PM section
- **`PMFooter.tsx`** - Footer khusus untuk PM section
- **`DashboardLayout.tsx`** - Layout dengan sidebar untuk dashboard
- **`index.ts`** - Export semua layout components

**Fungsi:**
- Konsistensi UI di seluruh aplikasi
- Reusable navigation & footer
- Setiap section (marketing, PM, work) bisa punya layout sendiri

**Contoh:**
```tsx
import { Header, Footer } from "@/components/layout";

export default function Page() {
  return (
    <>
      <Header />
      <main>Content</main>
      <Footer />
    </>
  );
}
```

---

### 📄 `/components/sections` - Page Sections

Component untuk **section-section** di homepage (marketing site).

#### Files:
- **`Hero.tsx`** - Hero section (bagian pertama homepage)
- **`About.tsx`** - About section (tentang studio)
- **`Projects.tsx`** - Portfolio/project showcase
- **`Testimonials.tsx`** - Testimonial dari klien
- **`FAQ.tsx`** - Frequently Asked Questions
- **`CTA.tsx`** - Call-to-Action section
- **`index.ts`** - Export semua sections

**Fungsi:**
- Memecah homepage jadi section-section kecil
- Mudah di-maintain dan di-edit
- Reusable di halaman lain jika perlu

**Contoh:**
```tsx
import { Hero, About, Projects } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
    </>
  );
}
```

---

### 🎨 `/components/ui` - UI Components (shadcn/ui)

Component **UI primitives** dari shadcn/ui library.

#### Files:
- **`button.tsx`** - Button component dengan variants
- **`card.tsx`** - Card component untuk konten
- **`accordion.tsx`** - Accordion/collapsible component

**Fungsi:**
- Reusable UI components
- Consistent design system
- Accessible (ARIA compliant)
- Customizable dengan Tailwind CSS

**Contoh:**
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

<Button variant="default">Click me</Button>
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Menambah UI Component:**
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

### 🔧 Component Lainnya

#### `ClientToaster.tsx`
**Fungsi:** Toast notifications (pop-up messages)
- Menggunakan library Sonner
- Client component (karena perlu interaktivity)

**Contoh:**
```tsx
import { toast } from "sonner";

toast.success("Data berhasil disimpan!");
toast.error("Terjadi kesalahan!");
```

#### `HomePage.tsx`
**Fungsi:** Component wrapper untuk homepage
- Menggabungkan semua sections
- Menggunakan hooks untuk animations

---

## 📊 Diagram Hubungan

```
app/
├── (marketing)/
│   └── page.tsx
│       └── HomePage.tsx
│           ├── useScrollAnimations() ← hooks/
│           ├── Header ← components/layout/
│           ├── Hero ← components/sections/
│           ├── Projects ← components/sections/
│           │   └── useCarousel() ← hooks/
│           └── Footer ← components/layout/
│
└── (pm)/
    └── pm/page.tsx
        ├── PMHeader ← components/layout/
        ├── Button ← components/ui/
        └── PMFooter ← components/layout/
```

---

## 🎯 Best Practices

### `/lib` - Utilities
✅ **DO:**
- Fungsi pure (tidak ada side effects)
- Type-safe dengan TypeScript
- Dokumentasi JSDoc

❌ **DON'T:**
- Jangan taruh React components di sini
- Jangan taruh business logic kompleks

### `/hooks` - Custom Hooks
✅ **DO:**
- Mulai nama dengan "use" (useCarousel, useAuth)
- Return value yang berguna
- Cleanup di useEffect

❌ **DON'T:**
- Jangan panggil hooks di dalam conditions
- Jangan buat hooks yang terlalu spesifik

### `/components` - Components
✅ **DO:**
- Satu component per file
- Props dengan TypeScript interface
- Pisahkan logic dan UI

❌ **DON'T:**
- Jangan buat component terlalu besar (>200 baris)
- Jangan hardcode data

---

## 📝 Contoh Menambah Fitur Baru

### Scenario: Tambah fitur "Dark Mode"

1. **Buat utility di `/lib`:**
```typescript
// lib/theme.ts
export function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
```

2. **Buat custom hook di `/hooks`:**
```typescript
// hooks/useDarkMode.ts
export function useDarkMode() {
  const [theme, setTheme] = useState(getTheme());
  // ... logic
  return { theme, toggleTheme };
}
```

3. **Buat UI component di `/components/ui`:**
```typescript
// components/ui/theme-toggle.tsx
export function ThemeToggle() {
  const { theme, toggleTheme } = useDarkMode();
  return <Button onClick={toggleTheme}>Toggle</Button>;
}
```

4. **Gunakan di layout:**
```typescript
// components/layout/Header.tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";
```

---

## 🚀 Tips

1. **Import Aliases:** Gunakan `@/` untuk import yang clean
   ```tsx
   import { cn } from "@/lib"
   import { Button } from "@/components/ui/button"
   ```

2. **Index Files:** Buat `index.ts` untuk export multiple files
   ```typescript
   export * from "./Header"
   export * from "./Footer"
   ```

3. **Type Safety:** Selalu define types untuk props
   ```tsx
   interface ButtonProps {
     variant: "default" | "outline";
     children: React.ReactNode;
   }
   ```
