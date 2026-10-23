# A little birthday universe for friend

A mobile-first React + Vite birthday journey: countdown, secret PIN, cake, video, balloons, memories, a sincere letter, a friendship note, and a final surprise.

This is a frontend-only gift site. The PIN is a playful lock, not real security. Anyone who inspects the files can find it.

## Run locally

```bash
cd friend -birthday
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Try it on your phone

1. Make sure your phone is on the same Wi-Fi as your computer.
2. Start the site with `npm run dev -- --host`.
3. On the phone, visit `http://YOUR-COMPUTER-IP:5173`.

## Customize

Edit `src/data/birthdayConfig.js`:

- `birthdayDate`, `birthdayTime`, `timeZone` — countdown target
- `secretPin` — four-digit playful lock (placeholder is `1234`)
- `signature` — closing signature
- photo / video / letter / balloon / friendship copy

## Personal media

Put files in `public/media/` and keep names in sync with the config:

- `birthday-video.mp4`
- `background-music.mp3`
- `memory-1.jpg`, `memory-2.jpg`, `memory-3.jpg`
- optional `memory-video-1.mp4`

Missing files show placeholders. The rest of the site still works.

Music never autoplays. The player starts off.

## Production build

```bash
npm run build
npm run preview
```

## Deploy on Netlify

1. Push this `friend -birthday` folder as a Git repo, or drag the project into Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. `netlify.toml` already includes SPA redirects.

If you deploy from a parent repo, set the Netlify base directory to `friend -birthday`.
