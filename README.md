# Toolmate Resume Builder

An ATS-friendly, highly customizable, and open-source Resume Builder built with modern web technologies. Engineered for a **300% true native mobile experience**, Toolmate Resume Builder features a Tinder-style swipeable template gallery, dynamic interactive PDF previews with pinch-to-zoom, and a beautiful drag-and-drop dark-mode builder interface.

## ✨ Features

- **Tinder-Style Swipeable Gallery (Mobile):** Immersive, full-screen swipeable template selection.
- **Native Mobile Previews:** `react-zoom-pan-pinch` integration allows users to naturally pan and pinch-to-zoom on their resume preview exactly like a native iOS/Android PDF app.
- **16 Professionally Designed Templates:** Spanning four categories (Developers, Executives, Creatives, and Minimalists), all heavily optimized for high ATS (Applicant Tracking System) parse rates.
- **Advanced Customization Engine:** Adjust typography (Inter, Roboto, Playfair Display, etc.), layout density (Compact, Comfortable, Relaxed), accent colors, date formatting rules, and dynamic section spacing.
- **Local-First & Secure:** Data is stored locally using `Zustand` with `persist`. No sign-up required, no data sent to external servers. Export and Import your JSON resume backups at any time.
- **PWA (Progressive Web App):** Fully installable on iOS, Android, and Desktop with offline support (`next-pwa`).
- **Drag & Drop Reordering:** Reorder your experience items effortlessly using `@dnd-kit`.
- **Pixel-Perfect PDF Generation:** Uses raw DOM injection and `@media print` CSS configurations to generate completely flawless, high-resolution PDFs using the native browser print engine.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **Icons:** [Lucide React](https://lucide.dev/)
- **Drag & Drop:** [@dnd-kit](https://docs.dndkit.com/)
- **Mobile Gestures:** `react-zoom-pan-pinch`
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js 18+ installed.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/prahladinala/toolmate-resume-builder.git
cd toolmate-resume-builder
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build & Production

The repository is configured with strong Husky hooks (`pre-commit` and `pre-push`) to ensure code quality using `eslint` and `prettier`.

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/prahladinala/toolmate-resume-builder/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
