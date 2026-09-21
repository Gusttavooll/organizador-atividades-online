---
name: frontend-design
description: Use this skill when building, reviewing, or improving frontend UI code (HTML, CSS, React, Vue, or similar). Covers visual design quality, layout, spacing, typography, color, responsiveness, and accessibility. Trigger on requests to build a UI, style a component, create a page/landing page, improve visual design, or review frontend code for design quality.
---

# Frontend Design

Guidance for producing frontend interfaces that look polished, professional, and consistent — not just functionally correct.

## When to use this skill

- Building a new UI component, page, or app from scratch
- Styling or restyling existing markup
- Reviewing frontend code for visual/UX quality
- Choosing colors, typography, spacing, or layout for a design system

## Core principles

1. **Establish a visual system before writing markup.**
   - Pick a small color palette (1 primary, 1–2 accent, neutrals for text/background/borders). Define them as CSS variables/tokens, never hardcode hex values inline.
   - Pick a type scale (e.g. 4–6 sizes) and stick to it. Avoid one-off font sizes.
   - Pick a spacing scale (e.g. 4/8px base unit: 4, 8, 12, 16, 24, 32, 48, 64). Avoid arbitrary margins/paddings.

2. **Hierarchy first.**
   - Every screen should have one clear primary action/focal point.
   - Use size, weight, and color — not just size — to differentiate heading levels.
   - Group related elements with proximity; separate unrelated ones with whitespace, not just borders/dividers.

3. **Consistency over novelty.**
   - Reuse existing components/patterns in the codebase before inventing new ones.
   - Keep border-radius, shadow style, and stroke widths consistent across all elements.

4. **Responsive by default.**
   - Design mobile-first; verify layouts don't break at narrow widths (320–420px) and wide desktop widths.
   - Prefer flexible layouts (flexbox/grid, relative units) over fixed pixel widths.

5. **Accessibility is not optional.**
   - Maintain WCAG AA contrast (4.5:1 for body text, 3:1 for large text/UI elements).
   - All interactive elements need visible focus states, adequate hit targets (~44px), and semantic HTML (button vs div, label for inputs).
   - Never convey information by color alone.

6. **Dark mode aware.**
   - If the project supports theming, define colors as tokens that can be redefined per theme rather than hardcoded per component.

## Workflow

1. Identify existing design tokens/conventions in the codebase (check for a theme file, tailwind config, CSS variables, or design system docs) and reuse them instead of introducing new ones.
2. If none exist and this is a new build, define a minimal token set up front (colors, type scale, spacing scale).
3. Build layout structure first (semantic HTML/component tree), then apply styling.
4. Check the result against: hierarchy, consistency, responsiveness, contrast/accessibility.
5. For a review task, call out issues in those same four categories rather than generic "looks fine" feedback.

## What to avoid

- Inline arbitrary hex colors or pixel values scattered across components instead of tokens.
- Centering everything / using only one layout pattern regardless of content.
- Overusing shadows, gradients, or rounded corners inconsistently.
- Low-contrast text (light gray on white, etc.).
- Missing hover/focus/active states on interactive elements.
