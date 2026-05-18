---
Task ID: 1
Agent: Main Agent
Task: Delete demo tests button, add AI chat to all test pages, add AI-generated test cover images

Work Log:
- Examined full project structure and all source files
- Deleted /api/seed/route.ts and removed handleSeed function from page.tsx
- Updated empty state text from "Create your first test or load demo tests" to "Create your first test"
- Added coverImage field to Prisma Test model, pushed to Neon DB
- Created /api/generate-cover/route.ts endpoint using z-ai-web-dev-sdk image generation
- Added topic-specific visual prompts (Physics, Chemistry, Math) for better cover images
- Updated GET /api/tests to return hasCoverImage boolean instead of full base64 data
- Added generateCover method to api.ts client
- Updated test cards with cover image display area (h-40) with:
  - AI-generated cover when available
  - Generating spinner animation during generation
  - Topic-specific gradient placeholders with emoji icons (Physics: ⚛️, Chemistry: 🧪, Math: 📐)
  - "Generate AI Cover" button for manual trigger
- Added auto-generation of covers on dashboard load (staggered 10s apart)
- Added rate-limit retry logic (up to 3 retries with 30/60/90s delays)
- Added "Ask AI Tutor" button in exam mode (visible after answering)
- Increased chat max_tokens from 500 to 800 for better explanations
- Enlarged chat panel (420px width, 680px height)
- Enhanced chat header to show answer status (correct/incorrect)
- Built and verified: all routes compile successfully
- Committed and pushed to GitHub (commit 77f339e)

Stage Summary:
- Demo tests button deleted, seed API removed
- AI chat available on all test pages (exam + practice mode)
- AI cover image generation system fully implemented
- Cover images auto-generate on dashboard visit
- Rate limit handling with retry and staggered generation
- Pushed to GitHub: https://github.com/Asilbekov/uuu
- Note: Image generation API was rate-limited during development; covers will generate on first dashboard visit when rate limit resets
