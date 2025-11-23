# ExternAI - AI-Powered Application Builder

ExternAI is a Lovable AI clone that enables users to create full-stack web applications through natural language conversations with AI. Simply describe what you want to build, and ExternAI will generate the code, design, and functionality for you.

## 🚀 Features

- **Natural Language Interface**: Describe your app in plain English
- **Real-time Code Generation**: Watch your application being built live
- **Modern Tech Stack**: Built with Next.js 16, TypeScript, and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Professional dark UI optimized for development
- **Component Library**: Reusable UI components with Radix UI primitives
- **Live Preview**: See your application as it's being generated

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **AI Integration**: OpenAI API (ready for integration)
- **Authentication**: NextAuth.js (ready for setup)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd externai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see ExternAI.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx    # Button component
│   │   ├── dialog.tsx    # Modal dialog component
│   │   └── input.tsx     # Input field component
│   ├── chat-interface.tsx # Main chat interface
│   └── header.tsx        # Application header
└── lib/                  # Utility functions
    └── utils.ts          # Common utility functions
```

## 🎯 Key Components

### ChatInterface
The main component that handles user interactions and AI conversations. Features:
- Message history management
- Quick start prompts for common use cases
- Real-time typing indicators
- Responsive layout with preview sidebar

### Header
Navigation and user management component with:
- Project management
- User authentication dialogs
- Settings and menu access

### UI Components
Reusable components built with Radix UI:
- Accessible button variants
- Modal dialogs
- Form inputs with proper styling

## 🔮 Planned Features

- [ ] OpenAI GPT-4 integration for code generation
- [ ] Real-time code preview and execution
- [ ] Project file management system
- [ ] User authentication and project saving
- [ ] Template library for quick starts
- [ ] Export functionality for generated projects
- [ ] Collaborative editing features
- [ ] Integration with popular frameworks (React, Vue, Angular)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by [Lovable AI](https://lovable.dev)
- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://radix-ui.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
