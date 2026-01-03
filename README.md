# Fraym 🎨

> Professional wireframing, diagramming, and design thinking tool built with Next.js

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

### 🎯 Three Powerful Tools in One Platform

- **Wireframe Editor**: Professional drag-and-drop canvas with 50+ UI components
- **Design Thinking Workspace**: Complete toolkit for user research and ideation
- **Diagram Editor**: Create flowcharts, UML diagrams, and BPMN workflows

### 🚀 Key Capabilities

- ✅ Drag-and-drop interface
- ✅ 50+ pre-built UI components
- ✅ Device presets (Mobile, Tablet, Desktop)
- ✅ Real-time auto-save
- ✅ High-resolution PNG export
- ✅ Design thinking tools (Empathy Maps, User Journeys, etc.)
- ✅ Professional diagram shapes library
- ✅ OAuth login (Google & GitHub)
- ✅ Responsive design
- ✅ Dark mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Database**: Local Storage (can be extended to Prisma + PostgreSQL)
- **Authentication**: NextAuth.js (OAuth ready)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/fraym.git
cd fraym
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For OAuth setup, see [OAUTH_SETUP.md](./OAUTH_SETUP.md)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fraym)

### Other Platforms

- **Netlify**: `npm run build` → Deploy `out` folder
- **Railway**: Connect GitHub repo → Auto-deploy
- **Docker**: See `Dockerfile` (coming soon)

## 📁 Project Structure

```
fraym/
├── app/                    # Next.js app directory
│   ├── landing/           # Landing page
│   ├── dashboard/         # User dashboard
│   ├── project/[id]/      # Wireframe editor
│   ├── design-thinking/   # Design thinking workspace
│   ├── diagram/[id]/      # Diagram editor
│   ├── login/             # Authentication
│   └── api/               # API routes
├── components/            # React components
│   ├── Canvas/           # Wireframe canvas
│   ├── DiagramEditor/    # Diagram editor
│   ├── DesignThinking/   # Design thinking tools
│   └── Marketing/        # Marketing pages
├── lib/                  # Utilities and helpers
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎨 Design System

Fraym uses a professional Figma-inspired design system:

- **Font**: Inter (primary), JetBrains Mono (code)
- **Colors**: Neutral grays with black accents
- **Borders**: Thin (1px) with subtle shadows
- **Radius**: 6-12px for modern feel
- **Spacing**: Consistent 4px grid system

## 🔐 Authentication

OAuth login is available with Google and GitHub. To enable:

1. Follow the setup guide in [OAUTH_SETUP.md](./OAUTH_SETUP.md)
2. Configure environment variables
3. OAuth buttons will automatically work

## 📊 Features Overview

### Wireframe Editor
- Infinite canvas with zoom/pan
- 50+ UI components
- Multi-select and grouping
- Properties panel
- Layer management
- Export to PNG

### Design Thinking
- Empathy Maps
- User Personas
- User Journey Maps
- Problem Statements
- Brainstorming Board
- Feature Prioritization
- Usability Testing

### Diagram Editor
- Flowcharts
- UML Diagrams
- BPMN Workflows
- Use Case Diagrams
- Collapsible categories
- Professional shapes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Inspired by Figma, Miro, and other design tools
- Built with [Next.js](https://nextjs.org/)

## 📧 Contact

- Website: [https://fraym.app](https://fraym.app)
- Email: support@fraym.app
- Twitter: [@fraymapp](https://twitter.com/fraymapp)

## 🗺️ Roadmap

- [ ] Real-time collaboration
- [ ] Version history
- [ ] Component libraries
- [ ] Templates marketplace
- [ ] AI-powered suggestions
- [ ] Mobile app
- [ ] API for integrations
- [ ] Team workspaces

---

**Made with ❤️ by the Fraym Team**
