# SourcePi AI interface

The design tokens live in `tailwind.css`. Reuse them rather than introducing
screen-specific palettes or type scales. The bundled Inter family is used for
navigation, forms, headings, answers and document metadata; code keeps monospace.

Use `BrandLogo` for the product signature. The approved mark combines a dark
magnifier, forest-green pixel pi and orange accents. The wordmark keeps SourcePi
in the primary text colour and AI in the accent colour. Dark mode uses the light
mark variant. `public/logo.svg` is the icon and favicon; `logo-dark.svg` is its
dark-mode counterpart. Feature-card pixel motifs remain separate from branding.

| Role | Size | Treatment |
| --- | --- | --- |
| Workspace hero | 40–72px, responsive | Bold, compact line height |
| Page title | 26–34px, responsive | `aw-title` |
| Section title | 20px | `aw-section-title` |
| Card title | 16px | Semibold |
| Body and navigation | 14px | Regular, generous line height |
| Labels | 13px | Regular or medium |
| Metadata | 12px | Secondary text colour |

Use semantic background, text and border tokens in component classes. Forest,
plum, orange and yellow are reserved for intentional colour blocks and identity
motifs; their paired foreground colours provide readable contrast. Primary
workspace actions use forest green. Both themes share the same spacing and type.

Use `RootLayoutContainer` for the application shell, `PageContainer` for scrolling
pages, `ListFilterBar` for list headings and controls, and `HomeCard` for application
and collection cards. Compose primitives from `src/components/ui/`; keep feature
styling outside that library. New cards and screens should reuse these patterns.

The workspace composer passes a draft to an existing chat assistant without
sending it. Recent conversations use the existing session API. The answer source
rail preserves inline citation numbering and document locations; smaller screens
use a sources sheet. Do not display invented documents, answers or activity.

For responsive work, check the main sidebar, feature navigation, content area and
overlays together. Tables may scroll inside their content area. Keep keyboard
focus visible, label icon controls, and respect reduced motion preferences.
