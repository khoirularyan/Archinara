# Archinara - Modern Architecture Studio

Studio arsitektur modern yang menghadirkan solusi desain inovatif untuk ruang hidup Anda.

## Struktur Project

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   └── sections/     # Page sections
│   │       ├── Hero.tsx
│   │       ├── Projects.tsx
│   │       ├── About.tsx
│   │       ├── CTA.tsx
│   │       ├── Testimonials.tsx
│   │       ├── FAQ.tsx
│   │       └── index.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── useScrollAnimations.ts
│   │   ├── useCarousel.ts
│   │   └── index.ts
│   └── lib/              # Utility functions
│       ├── utils.ts
│       └── index.ts
└── public/
    └── images/           # Static images
```

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
pnpm build
```

## Features

- 🎨 Modern and responsive design
- ⚡ Optimized performance
- 📱 Mobile-first approach
- ♿ Accessibility features
- 🎭 Smooth animations and transitions
- 🔄 Auto-playing carousel with touch support
- 📧 Google Analytics integration
