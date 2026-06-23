# Testimonial videos

Drop client testimonial video files (and optional poster images) in this folder.
Everything in `public/` is served from the site root, so a file here named
`sarah-highlight.mp4` is referenced as `testimonials/sarah-highlight.mp4`.

## How it maps to a card

Each card in `src/app/components/testimonials/testimonials.component.ts` is one
client:

- `videoSrc` / `posterImage` — the **highlight** cut that plays by default.
- `clips[]` — the other cuts taken from the same client's testimonial. They
  appear in the collapsible "more clips" panel; selecting one swaps it into the
  card's player and plays it.

Suggested naming so files stay grouped by client:

```
testimonials/
  sarah-highlight.mp4
  sarah-why-she-joined.mp4
  sarah-turning-point.mp4
  sarah-now.mp4
  sarah-poster.jpg
```

Videos are displayed in a 9:16 (vertical) frame and `object-fit: cover`, so
portrait clips look best.
