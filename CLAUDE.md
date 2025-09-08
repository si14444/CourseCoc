# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CourseCoc is a Next.js 15.5.2 application using the App Router with TypeScript and TailwindCSS v4. The project features a custom coral pink design system optimized for a romantic, modern aesthetic targeting MZ generation users.

## Development Commands

```bash
# Development (with Turbopack)
npm run dev

# Build (with Turbopack)
npm run build

# Production server
npm run start

# Linting
npm run lint
```

## Architecture & Structure

### Technology Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4 + Custom CSS Variables
- **Build Tool**: Turbopack (enabled by default)
- **Fonts**: Geist Sans & Geist Mono from Google Fonts

### Project Structure
```
src/
├── app/
│   ├── layout.tsx        # Root layout with font configuration
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles with coral pink theme
```

### Import Alias
Uses `@/*` for `./src/*` path mapping configured in tsconfig.json.

### Design System

The project implements a comprehensive coral pink color system defined in `src/app/globals.css`:

**Primary Colors:**
- `--primary-color: #ff6b6b` (coral pink) - main buttons, links, emphasis
- `--secondary-color: #ffe0e0` (light pink) - backgrounds, secondary elements  
- `--accent-color: #fff2f2` (very light pink) - card backgrounds, subtle emphasis
- `--background: #fefefe` (warm white) - main page background

**Key Features:**
- Automatic dark mode support with optimized coral pink visibility
- Complete UI component styling (buttons, inputs, cards, headers, footers)
- CSS variable-based system for easy customization
- MZ generation-friendly romantic aesthetic
- Built-in animations (`.animate-float`, `.animate-pulse-romantic`)
- Comprehensive utility classes (`.text-primary`, `.bg-accent`, etc.)

### Font Configuration
- **Primary**: Geist Sans (`--font-geist-sans`)
- **Monospace**: Geist Mono (`--font-geist-mono`)
- Applied globally via CSS variables in layout.tsx

## Development Rules & Guidelines

### CSS 변수 시스템 사용 규칙 (MANDATORY)

**⚠️ 절대 규칙: 모든 컬러 관련 스타일링은 반드시 CSS 변수를 사용해야 합니다.**

```css
/* ✅ 올바른 사용법 */
.my-component {
  background-color: var(--primary-color);
  border-color: var(--border);
  color: var(--foreground);
}

/* ❌ 금지된 사용법 */
.my-component {
  background-color: #ff6b6b;    /* 하드코딩된 컬러값 금지 */
  border-color: #ffe0e0;        /* 하드코딩된 컬러값 금지 */
  color: #333;                  /* 하드코딩된 컬러값 금지 */
}
```

**필수 CSS 변수 목록:**
- `--primary-color`, `--primary-hover`, `--primary-active`
- `--secondary-color`, `--secondary-hover`  
- `--accent-color`, `--accent-hover`
- `--background`, `--surface`, `--foreground`
- `--border`, `--border-light`, `--divider`
- `--success`, `--warning`, `--error`, `--info`

**위반 시 조치:**
- 하드코딩된 컬러값 발견 시 즉시 CSS 변수로 교체
- 새로운 컬러가 필요한 경우 `globals.css`에 변수 추가 후 사용
- 브랜드 일관성을 위해 기존 변수 활용 최우선

### 스타일링 우선순위

1. **CSS 변수 사용** (필수)
2. **기존 유틸리티 클래스 활용** (`.text-primary`, `.bg-accent` 등)
3. **TailwindCSS 클래스** (CSS 변수와 함께 사용)
4. **커스텀 CSS** (CSS 변수 기반으로만)

### 컴포넌트 스타일링 체크리스트

- [ ] CSS 변수만 사용했는가?
- [ ] 다크모드에서 정상 작동하는가?
- [ ] 코럴 핑크 테마와 일치하는가?
- [ ] 기존 디자인 시스템과 일관성이 있는가?

## Development Notes

- The project is optimized for Turbopack and uses it by default for both dev and build
- TypeScript strict mode is enabled
- Uses React 19.1.0 with concurrent features
- Dark mode support is automatic based on user preference