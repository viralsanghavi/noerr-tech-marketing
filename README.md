# no.err marketing site

Remix + Vite, built as a client-rendered SPA (`ssr: false`) and served as static
files from Firebase Hosting. Site copy lives in Sanity.

## Development

```sh
npm run dev
```

Content comes from the committed snapshot at `app/data/generated/content.json`,
so dev works offline and without Sanity credentials.

## Content

Copy is edited in the Sanity Studio at [noerrtech.sanity.studio](https://noerrtech.sanity.studio).
Its source lives in `studio-noerr-tech/` in this repo — a separate app with its
own dependencies, so run `npm install` in there before `npm run dev` or
`npx sanity deploy`. Because there is no server at runtime,
**content is baked in at build time — an edit is not live until the site is
rebuilt and redeployed.**

```sh
npm run content        # pull from Sanity into app/data/generated/content.json
npm run build:content  # pull, then build
```

`npm run content` validates everything it fetches and writes nothing if the
content is unusable, so a bad fetch can't overwrite a good snapshot. It fails on:

- a missing or malformed field, or an empty list (usually a wrong dataset, or
  documents left unpublished)
- a project whose media is missing from `public/work`

Commit the regenerated `content.json` — it is the fallback every build starts from.

Ordering is whatever the Studio's drag-and-drop lists say. The work strip derives
its `01…07` numbering from list position, so reordering in the Studio is all it
takes to renumber the site.

### Project media

Posters and clips are **not** in Sanity — Sanity file assets are served as raw
downloads with no transcoding, which is the wrong home for autoplaying video. They
live in `public/work` and are captured from the live site:

```sh
npm run capture -- <mediaSlug> <url> --depth=4
```

That writes `<mediaSlug>.jpg` (2880×1800 poster), `.mp4` and `.webm`
(960×600, 24fps, 3s). The `mediaSlug` must match the field on the project in the
Studio. Adding a project in the Studio therefore still needs this one step in the
repo — the build fails loudly if the files are missing.

### Adding a project

Adding a 7th+ panel also means updating the pinned-scroll height in
`app/components/Work/index.tsx` — see the comment above `PANEL_VW`.

## Deployment

```sh
npm run build
firebase deploy --only hosting
```

`.github/workflows/deploy.yml` does this automatically on push to `main`, and on
a `repository_dispatch` from the Sanity webhook so content edits redeploy. It
needs one repository secret, `FIREBASE_SERVICE_ACCOUNT`; see the workflow file.
