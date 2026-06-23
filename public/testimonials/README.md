# Testimonial videos

Drop client testimonial files in this folder. Everything in `public/` is served
from the site root, so a file at `public/testimonials/sarah/highlight.mp4` is
referenced in code as `testimonials/sarah/highlight.mp4`.

## How it maps to a card

Each card in `src/app/components/testimonials/testimonials.component.ts` is one
client:

- `videoSrc` / `posterImage` — the **highlight** cut that plays by default.
- `clips[]` — the other cuts taken from the same client's testimonial, each with
  its own `videoSrc` and `posterImage`. They appear in the collapsible "more
  clips" panel; selecting one swaps it into the card's player and plays it.

## Folder layout

One folder per client keeps the highlight and its clips grouped:

```
testimonials/
  sarah/
    highlight.mp4        highlight.jpg
    why-she-joined.mp4   why-she-joined.jpg
    turning-point.mp4    turning-point.jpg
    now.mp4              now.jpg
```

The filenames above are exactly what the `Sarah K.` example expects, so dropping
matching files into `testimonials/sarah/` makes that card play with no code
changes.

## Format tips

- Videos are shown in a 9:16 (vertical) frame with `object-fit: cover`, so
  portrait footage looks best.
- `.mp4` (H.264) is referenced in the template's `<source type="video/mp4">`.
- A poster image (a representative still) is shown before playback and as the
  clip's thumbnail in the panel. It's optional but recommended.
