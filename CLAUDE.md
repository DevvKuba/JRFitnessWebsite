# JR Fitness Website

Angular SPA (standalone components, signals) for a personal-training business.
The home page is a single-scroll landing page composed of section components in
`src/app/components/` (hero, methodology, transformations, testimonials,
offerings, footer), with an `apply` page for the coaching application.

## Marketing skills (vendored)

A focused set of Corey Haines' marketing skills lives in
[.claude/skills/](.claude/skills/) so Claude can run real marketing workflows on
this site. They are auto-invoked when a request matches their description, or you
can call them explicitly (e.g. `/seo-audit`).

Source: https://github.com/coreyhaines31/marketingskills (MIT © Corey Haines).
Vendored, not linked — update by re-copying from the repo when you want newer
versions.

**Run [`product-marketing`](.claude/skills/product-marketing/SKILL.md) first.** It
creates `.agents/product-marketing.md` (JR Fitness positioning, audience, offer)
that every other skill reads, so the rest produce on-brand output instead of
generic advice.

| Skill | Goal it serves | What it does |
| --- | --- | --- |
| [`product-marketing`](.claude/skills/product-marketing/SKILL.md) | Foundation for all others | Captures positioning, ICP, and offer into `.agents/product-marketing.md`. |
| [`launch`](.claude/skills/launch/SKILL.md) | **Launch strategy for the application** | Go-to-market / launch plan and checklist for opening coaching applications. |
| [`analytics`](.claude/skills/analytics/SKILL.md) | **Website analytics — traffic, visitors, sources** | GA4/GTM setup, event + conversion tracking, UTM/attribution (references in `analytics/references/`). |
| [`seo-audit`](.claude/skills/seo-audit/SKILL.md) | **SEO audit → site updates** (priority) | Technical + on-page SEO audit, then concrete fixes to apply to the site. |
| [`schema`](.claude/skills/schema/SKILL.md) | Supports SEO | JSON-LD structured data (e.g. `LocalBusiness`, `Person`, `FAQ`, review markup) for rich results. |
| [`ai-seo`](.claude/skills/ai-seo/SKILL.md) | Supports SEO | Optimise to be cited by AI search (ChatGPT, Perplexity, AI Overviews); `llms.txt` / OKF. |

Not vendored but referenced by the above (add later if needed): `marketing-ideas`
and `offers` (for `launch`), `programmatic-seo` (for `seo-audit`).

### Suggested order for the stated goals
1. `product-marketing` — establish context once.
2. `seo-audit` → apply fixes → `schema` → `ai-seo` (the priority: get the site discoverable and updated).
3. `analytics` — instrument the site so traffic/sources/visitors are measurable before driving traffic.
4. `launch` — plan the application launch on top of an optimised, measured site.
