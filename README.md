# Reddit Comment Generator

Generate authentic, human-sounding Reddit comments from a post title, body, and optional image using Gemini.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](#)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Gemini](https://img.shields.io/badge/AI-Gemini-orange)](#)

## Live Demo

- App URL : **https://reddit-comment-generator-xi.vercel.app/**

## Screenshot

![App Screenshot](https://github.com/user-attachments/assets/0c2771bd-730c-49d8-9bf3-9ce485bd92f6)


## Project Details

This project is a Next.js app that helps generate short Reddit-style comments with a realistic tone.

### Core Features

- Input post title and body
- Optional image upload with preview
- AI-generated comment output
- Copy-to-clipboard and regenerate actions
- Server Action for secure Gemini API calls

### Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Motion (`motion/react`) for UI animations
- Gemini via `@google/genai`

### Environment Variables

Create `.env.local` and add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## How To Run

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production app
- `npm run start` - Run production server
- `npm run lint` - Run ESLint checks
- `npm run clean` - Clean Next.js artifacts
