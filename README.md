<p align="center">
  <img src="public/buidl-now-logo.svg" alt="Buidl Now" width="200" />
</p>

Buidl Now! Developer tools for builders who ship fast. A comprehensive suite of developer tools and Web3 utilities.

## Features

- 🔧 Developer Tools (Base64, Hash Generator, etc.)
- 🌐 Web3 Utilities (Function Selector, Keccak-256, etc.)
- ⚡ Built with Next.js 16 & React 19
- 🎨 Tailwind CSS 4 (CSS-first approach)
- 🔥 TypeScript
- 📦 Modular tool architecture

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Tech Stack

- **Framework:** Next.js 16.0.0
- **React:** 19.2.0
- **Styling:** Tailwind CSS 4.1.16
- **TypeScript:** 5.9.3
- **Web3:** Viem 2.38.5, Wagmi 2.19.0

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── tools/[id]/        # Dynamic tool pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── header.tsx
│   └── footer.tsx
├── tools/                # Tool implementations
│   ├── function-selector.tsx
│   ├── base64-text.tsx
│   ├── hash-generator.tsx
│   ├── keccak-hash.tsx
│   └── index.ts
├── lib/                  # Utilities
└── types/                # TypeScript types
```

## Adding a New Tool

1. Create a new file in `src/tools/your-tool.tsx`:

```typescript
"use client";

import { ToolConfig } from "@/types/tool";

export function YourTool() {
  return <div>Your tool UI here</div>;
}

export const yourToolConfig: ToolConfig = {
  id: "your-tool",
  name: "Your Tool Name",
  description: "Tool description",
  category: "converters",
  component: YourTool,
  examples: [],
  references: [],
};
```

2. Register it in `src/tools/index.ts`:

```typescript
import { yourToolConfig } from "./your-tool";

export const toolRegistry = {
  // ... other tools
  "your-tool": yourToolConfig,
};
```

3. Add to the tools list in `src/lib/tools-list.ts`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Buidl Team - [https://buidlnow.com](https://buidlnow.com)

Project Link: [https://github.com/berkekiran/buidl-now](https://github.com/berkekiran/buidl-now) 