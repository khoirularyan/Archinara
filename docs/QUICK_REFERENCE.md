# Quick Reference - Folder Structure

Panduan cepat untuk memahami struktur folder project.

---

## 🗂️ Struktur Lengkap

```
src/
├── app/                    # Next.js App Router (Routes)
│   ├── (marketing)/       # Marketing site (URL: /)
│   ├── (pm)/              # Project Management (URL: /pm/*)
│   ├── (work)/            # Work Management (URL: /work/*)
│   └── api/               # API endpoints
│
├── components/            # React Components
│   ├── layout/           # 🏗️ Header, Footer, Navigation
│   ├── sections/         # 📄 Hero, About, Projects, dll
│   ├── ui/               # 🎨 Button, Card, Accordion (shadcn/ui)
│   └── *.tsx             # Component lainnya
│
├── hooks/                # 🎣 Custom React Hooks
│   ├── useCarousel.ts    # Carousel/slider logic
│   └── useScrollAnimations.ts # Scroll animations
│
└── lib/                  # 📚 Utility Functions
    └── utils.ts          # Helper functions (cn, dll)
```

---

## 📚 `/lib` - Utilities

**Apa itu?** Tempat untuk fungsi-fungsi helper yang dipakai di mana-mana.

**Contoh Isi:**
- ✅ Format tanggal: `formatDate(date)`
- ✅ Validasi: `isValidEmail(email)`
- ✅ Class merger: `cn(class1, class2)`
- ✅ API helpers: `fetcher(url)`

**Kapan Pakai?**
```tsx
// ❌ JANGAN ini (duplikasi)
<div className="bg-blue-500 hover:bg-blue-600">
<div className="bg-blue-500 hover:bg-blue-600">

// ✅ PAKAI ini (reusable)
import { cn } from "@/lib"
const buttonClass = cn("bg-blue-500", "hover:bg-blue-600")
```

---

## 🎣 `/hooks` - Custom Hooks

**Apa itu?** Logic React yang bisa dipakai ulang di banyak component.

**Contoh yang Ada:**

### 1. `useCarousel()` - Carousel Logic
```tsx
import { useCarousel } from "@/hooks";

function Gallery() {
  const carouselRef = useCarousel(); // ← Magic happens here!
  
  return (
    <div ref={carouselRef}>
      <div className="carousel-content">
        <img src="1.jpg" />
        <img src="2.jpg" />
      </div>
    </div>
  );
}
```
**Fitur:** Auto-play, swipe, dots navigation

### 2. `useScrollAnimations()` - Scroll Effects
```tsx
import { useScrollAnimations } from "@/hooks";

function Page() {
  useScrollAnimations(); // ← Aktifkan animasi
  
  return (
    <div className="animate-element opacity-0">
      Akan muncul saat di-scroll! ✨
    </div>
  );
}
```
**Fitur:** Fade in, parallax, reveal on scroll

**Kapan Buat Hook Baru?**
- ✅ Logic yang dipakai di 2+ component
- ✅ State management yang kompleks
- ✅ API calls, localStorage, dll

---

## 🧩 `/components` - React Components

### 🏗️ `/layout` - Layout Components

**Fungsi:** Struktur halaman (Header, Footer, Sidebar)

```
layout/
├── Header.tsx        → Navbar marketing site
├── Footer.tsx        → Footer marketing site
├── PMHeader.tsx      → Navbar PM section
├── PMFooter.tsx      → Footer PM section
└── DashboardLayout.tsx → Dashboard dengan sidebar
```

**Contoh Pakai:**
```tsx
import { Header, Footer } from "@/components/layout";

<Header />
<main>Your content</main>
<Footer />
```

---

### 📄 `/sections` - Page Sections

**Fungsi:** Bagian-bagian homepage (Hero, About, Projects)

```
sections/
├── Hero.tsx          → Bagian pertama (judul besar + CTA)
├── About.tsx         → Tentang studio
├── Projects.tsx      → Portfolio showcase
├── Testimonials.tsx  → Review klien
├── FAQ.tsx           → Pertanyaan umum
└── CTA.tsx           → Call-to-action
```

**Contoh Pakai:**
```tsx
import { Hero, About, Projects } from "@/components/sections";

<Hero />
<About />
<Projects />
```

**Kenapa Dipisah?**
- ✅ Mudah di-edit (cari file yang tepat)
- ✅ Reusable (pakai di halaman lain)
- ✅ Clean code (tidak 1000 baris dalam 1 file)

---

### 🎨 `/ui` - UI Components

**Fungsi:** Component dasar dari shadcn/ui (Button, Card, dll)

```
ui/
├── button.tsx        → Tombol dengan variants
├── card.tsx          → Card untuk konten
└── accordion.tsx     → Accordion/collapse
```

**Contoh Pakai:**
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

<Button variant="default">Save</Button>
<Button variant="outline">Cancel</Button>

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

**Tambah Component Baru:**
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
```

---

## 🎯 Kapan Pakai Apa?

| Kebutuhan | Folder | Contoh |
|-----------|--------|--------|
| Fungsi helper | `/lib` | Format tanggal, validasi |
| Logic reusable | `/hooks` | useAuth, useForm |
| Layout halaman | `/components/layout` | Header, Footer |
| Section homepage | `/components/sections` | Hero, About |
| UI primitives | `/components/ui` | Button, Card |
| Feature component | `/components` | LoginForm, ProductCard |

---

## 💡 Tips Cepat

### 1. Import dengan Alias `@/`
```tsx
// ✅ BAGUS
import { cn } from "@/lib"
import { Button } from "@/components/ui/button"

// ❌ JELEK
import { cn } from "../../lib/utils"
import { Button } from "../../../components/ui/button"
```

### 2. Export dengan `index.ts`
```typescript
// components/layout/index.ts
export * from "./Header"
export * from "./Footer"

// Sekarang bisa:
import { Header, Footer } from "@/components/layout"
```

### 3. Type Props dengan Interface
```tsx
interface ButtonProps {
  variant: "default" | "outline";
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  // ...
}
```

---

## 🚀 Workflow: Tambah Fitur Baru

### Contoh: Fitur "Search"

1. **Buat utility di `/lib`** (jika perlu)
```typescript
// lib/search.ts
export function filterItems(items: Item[], query: string) {
  return items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}
```

2. **Buat hook di `/hooks`** (jika logic kompleks)
```typescript
// hooks/useSearch.ts
export function useSearch(items: Item[]) {
  const [query, setQuery] = useState("");
  const results = filterItems(items, query);
  return { query, setQuery, results };
}
```

3. **Buat UI component di `/components/ui`**
```tsx
// components/ui/search-input.tsx
export function SearchInput({ value, onChange }: Props) {
  return <input type="search" value={value} onChange={onChange} />;
}
```

4. **Buat feature component**
```tsx
// components/SearchBar.tsx
import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "@/components/ui/search-input";

export function SearchBar({ items }: Props) {
  const { query, setQuery, results } = useSearch(items);
  
  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <Results items={results} />
    </div>
  );
}
```

---

## 📖 Dokumentasi Lengkap

Lihat file berikut untuk detail lebih lanjut:
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Penjelasan detail setiap folder
- [APP_STRUCTURE.md](./APP_STRUCTURE.md) - Struktur route groups
- [README.md](../README.md) - Overview project
