# Personal media for Bhoomi’s birthday site

Drop your files in this folder. Keep the filenames matching `src/data/birthdayConfig.js`, or update the config paths.

Suggested files:

- `birthday-video.mp4` — your personal video message (Screen 4)
- `background-music.mp3` — optional background music (off by default)
- `memory-1.jpg`, `memory-2.jpg`, `memory-3.jpg` — gallery photos
- `memory-video-1.mp4` — optional gallery video
- `sfx-pop.mp3`, `sfx-success.mp3`, `sfx-open.mp3` — optional sound effects

The site keeps working if files are missing. Placeholders appear instead of broken media.

Keep photos reasonably sized (under ~1.5 MB each) so the site stays smooth on phones.

GitHub is not required for photos to show. After `npm run build`, files in this folder are copied into `dist` and Netlify can serve them.

If you connect GitHub to Netlify, then yes — these files need to be in the repo (or hosted elsewhere, like a Drive/Cloudinary link in `birthdayConfig.js`). GitHub rejects files over 100 MB, so keep videos smaller or host them outside GitHub.
