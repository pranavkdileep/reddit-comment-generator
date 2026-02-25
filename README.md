# Reddit Comment Generator

Generate authentic, human-sounding Reddit comments from a post title, body, and optional image using Gemini or Gemma.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](#)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Gemini](https://img.shields.io/badge/AI-Gemini-orange)](#)
[![Gemma](https://img.shields.io/badge/AI-Gemma-76B900)](#)

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
- Model toggle (Gemini or Gemma)
- Copy-to-clipboard and regenerate actions
- Server Actions for secure Gemini and NVIDIA API calls

### Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Motion (`motion/react`) for UI animations
- Gemini via `@google/genai`
- Gemma 3 via NVIDIA Integrate API

### Environment Variables

Create `.env.local` and add:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
```

Notes:
- `GEMINI_API_KEY` is required when using the `Gemini` model option.
- `NVIDIA_API_KEY` is required when using the `Gemma` model option.

## How To Run

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
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
