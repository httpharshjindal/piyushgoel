---
name: ui-ux-portfolio
description: Create and refine production-ready portfolio UIs with strong visual hierarchy, editorial spacing, configurable cards, testimonials, and section-driven layouts. Use when building or revising a portfolio, personal site, landing page, or UI system that must feel polished, configurable, and not AI-generated.
---

# Ui Ux Portfolio

## Core Rules

- Build around one clear visual story, not a generic component stack.
- Prefer editorial spacing, strong type contrast, and calm motion.
- Make images, links, and section content configurable through data.
- Avoid symmetric, over-decorated layouts that read as AI-generated.
- Keep the page production-ready on desktop and mobile without special casing the design into a demo.

## Portfolio Direction

Use this skill when a task involves:

- Reworking a portfolio hero, work grid, testimonial strip, or contact section.
- Turning cards into reusable content blocks with editable image sizes, link targets, labels, and descriptions.
- Harmonizing multiple sections into a single visual language.
- Replacing template-looking UI with a more intentional, branded layout.

## Design Checks

Before shipping a portfolio update, verify:

1. The hero has a clear headline, supporting copy, and two or three direct actions.
2. The work section has consistent image aspect ratios and readable card text.
3. Links, thumbnails, and card sizing can be changed from data, not hardcoded in markup.
4. Testimonials feel like real quotes, not placeholder text.
5. The page has enough whitespace, contrast, and hierarchy to feel finished.
6. Motion is subtle and supports scannability, not decoration.

## Implementation Notes

- Use section metadata for layout, card width, card height, columns, accent color, and visibility.
- Prefer data-driven content for hero stats, service chips, featured work, testimonials, and contact details.
- Keep reusable components narrow in scope: one component for hero, one for section shell, one for cards, one for testimonials.
- If a reference or inspiration exists, mirror its density, rhythm, and tonal balance first; do not copy literal content.

## References

- Use `references/portfolio-ui.md` for the portfolio-specific visual rules, content structure, and update order.
