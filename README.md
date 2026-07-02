# Wilde

A clean, multi-format Hugo theme for personal blogs, built on
[tinycss](https://github.com/jbfriedrich/tinycss) — vendored as a nested git
submodule at `assets/tinycss/`. One design serves two blogs (jason.re and
outofscope.blog); a single config switch picks the homepage behaviour and a
single hue re-themes the colours.

It renders the four [publicare](../publicare) post types:

| Section  | Type   | URL                              | Card style |
|----------|--------|----------------------------------|------------|
| `posts`  | Post   | `/posts/:slug`                   | Title + excerpt + "Read more" |
| `notes`  | Note   | `/notes/:timestamp`              | Body-as-headline micro post |
| `links`  | Link   | `/links/:domain/:timestamp`      | Jim Nielsen: domain → title-out → date/domain footer |
| `photos` | Photo  | `/photos/:year/:month/:slug`     | Cover thumbnail; grid section + gallery single |

## Presets

Set `params.preset` in the site config:

- **`stream`** (jason.re) — homepage shows the latest `homeCount` entries of *every*
  type mixed, as compact dated rows. Used for a personal blog.
- **`hybrid`** (outofscope) — homepage interleaves `posts` + `links` + `notes` as feed
  cards (paginated); photos are excluded from the stream and browsed at `/photos/` as a grid.

## Config params

```yaml
params:
  preset: hybrid          # "stream" | "hybrid"
  hue: 200                # primary HSL hue (re-themes the whole site)
  altHue: 265             # secondary hue
  homeCount: 12           # stream preset: entries on the homepage
  feedSections: [posts, links, notes]  # hybrid preset: sections in the home/feed stream
  tagline: "…"            # shown under the brand in the header
  description: "…"        # meta description / feed subtitle
  author:
    display_name: "…"
    fediverse_handle: "@you@instance"
```

Required site config (see each blog's `config.yaml`):

- `permalinks` for posts/notes/links/photos (links **must** use `/:sections/…`).
- `outputs.home: [HTML, Atom, JSON]` — JSON powers the search index at `/index.json`.
- An Atom `outputFormat` (`application/atom+xml`) for feeds.
- A `menu.main` and `content/archive.md` (`layout: archive`) for the Archive + search page.

### Colour & accessibility

The whole palette derives from `--hue` / `--alt-hue` (HSL). Light-mode link colour is
darkened to ~38% L in tinycss `style.css` so normal-size links clear WCAG AA (4.5:1) on
white across the hue range. Verify new hues with `tinycss/accessibility-report.js`.

## Search

Search is **Hugo-native, no Node/Pagefind**: `layouts/index.json` emits an index of every
entry; the Archive page loads it into [Fuse.js](assets/js/vendor/fuse.min.js) via
`assets/js/search.js`. The year-grouped archive stays visible until the user types.

## Link domains (important)

Per-domain link archives (`/links/<domain>/`) and the domain in the URL require each
`content/links/<domain>/` folder to contain an `_index.md`:

```markdown
---
title: example.com
---
```

Without it, Hugo treats the folder as a plain path component, collapsing links to
`/links/<timestamp>/` and dropping the per-domain page. **publicare should emit an
`_index.md` when it first creates a domain folder.** Existing folders already have one.

## Packaging / deployment

This theme is its own git repo with **tinycss vendored as a nested submodule** at
`assets/tinycss/` (the whole stylesheet is `tinycss/style.css`, bundled by Hugo Pipes
into `/css/wilde.css`). Each blog consumes it as a submodule at `themes/wilde`:

```bash
# in each blog:
git submodule add git@github.com:jbfriedrich/wilde.git themes/wilde
```

The blogs' CI workflows check out with `submodules: recursive`, which fetches both this
theme and its nested tinycss. To update tinycss later:

```bash
cd themes/wilde/assets/tinycss && git pull origin main   # or: git submodule update --remote
cd -- ../../.. && git add assets/tinycss && git commit -m "Update tinycss"
```
