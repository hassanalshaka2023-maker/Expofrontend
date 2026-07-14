# HOPEX Landing Page

A premium, responsive React + TypeScript landing page for the HOPEX exhibition management platform.

## Included

- Cinematic animated hero with a cursor-reactive canvas background
- HOPEX logo reveal using the official cyan, navy, and gold palette
- Dedicated calls to action for `/login` and the public `/map`
- Product capability, dashboard, visitor experience, audience, workflow, and final CTA sections
- Responsive mobile navigation
- Reduced-motion accessibility support
- Placeholder routes for Login and Interactive Map integration

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Integration notes

- Replace the `/login` placeholder route with the existing authentication feature.
- Replace the `/map` placeholder route with the public Three.js visitor map.
- The visitor map remains public and does not require authentication.
- All user-facing copy is in English.

## Replace before launch

- Update the placeholder contact email in the footer.
- Point `/login` and `/map` to the real feature routes used by your application.
