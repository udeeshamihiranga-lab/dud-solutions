# DUD Solutions: Website Project

A static website built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Folder structure

```
dud-solutions/
├── index.html         Home
├── services.html      Services
├── projects.html      Projects (with category filter)
├── about.html         About Us
├── contact.html       Contact (inquiry form)
├── css/
│   └── styles.css     All styles, split into commented sections
├── js/
│   └── main.js        Theme toggle, mobile menu, project filter, contact form
└── assets/
    team
        member-01.jpg
        member-02.jpg
        member-03.jpg 
    ├── logo.svg
    └── favicon.svg
    
```

## Run it

Double-click `index.html`, or serve the folder locally:

```
npx serve .
# or
python3 -m http.server 8000
```

## How the code is organised

**CSS** (`css/styles.css`) is written top to bottom in sections, each with a banner comment:
design tokens → base styles → header → buttons → hero → page sections → service cards →
project cards → process steps → about → call-to-action → contact → footer → responsive rules.

**Class names** say what the thing is:

| Pattern            | Meaning                         | Example                                  |
| ------------------ | ------------------------------- | ---------------------------------------- |
| `.component`       | A building block                | `.service-card`, `.project-body`         |
| `.component--name` | A variation of that block       | `.btn--primary`, `.hero--centered`       |
| `.is-state`        | A state that JavaScript toggles | `.is-active`, `.is-open`, `.is-hidden`   |

**Colors** are CSS variables at the top of the stylesheet (`--color-violet`, `--color-navy`,
`--color-surface`, ...). Change them once and the whole site follows. Light and dark values
live in the same place.

**JavaScript** (`js/main.js`) has four numbered sections. Each one checks that its elements exist
before doing anything, so the same file is used on every page.

## Common edits

- **Change the brand color:** edit `--color-violet` in `css/styles.css`.
- **Add a service card:** copy one `<a class="service-card">` block in `services.html`.
- **Add a project:** copy one `<article class="project-card">` in `projects.html` and set
  `data-category` to one of the filter names.
- **Connect the contact form:** find the `TODO` in `js/main.js` and send the form data to your
  backend or an email service.
- **Header, footer and the call-to-action band** are repeated in every page file, so update
  them in each page.

## Deploy

Upload the folder to any static host (Netlify, Vercel, GitHub Pages, cPanel...).
