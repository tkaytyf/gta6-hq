# Gatorline: unofficial GTA 6 tips, clues and news (local preview; live site still at the old GTA6 HQ URL)

Unofficial fan site. Not affiliated with Rockstar Games or Take-Two Interactive.
Hero art: purewallfr (DeviantArt). Official screenshots are © Rockstar Games and are credited where shown.

**Live:** https://tkaytyf.github.io/gta6-hq/ (GitHub Pages, main branch root). Published with tkay's approval.

## Run locally
```
cd /workspace/gta6-site && python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/
```

## Structure (32 pages, static, works on GitHub Pages)
- `index.html`: home page in the style of the Rockstar Ultimate Edition page. It has a horizontal Tips & Clues track, a daily "Did you know" clue, links to each hub, an "updated today" feed and TBA countdowns.
- **Guides hub** (`guides.html`), 14 guides: first-10-hours, money, missions, heists, secrets, collectibles, activities, wanted, shops, properties, characters, radio, trophies, compare.
- **Tools hub** (`tools.html`), 7 tools: carryover (calculator and quiz), checklist, car-finder, loadout, heist-planner, challenge, rank-card.
- **Database hub** (`database.html`), 6 pages: map (Leaflet), cars, weapons, news, dlc, media.
- `community.html`: local bracket polls, plus placeholders for tips, newsletter, socials, creators, speedruns and ads.
- `sitemap.xml`, `robots.txt`, `404.html`, `assets/favicon.svg`.
- Data files: `data.js` (cars, weapons, missions, news), `js/hq-data.js`, `js/radio.js`, `js/trophies.js`.
- `assets/vendor/leaflet/`: Leaflet 1.9.4 (BSD-2), stored locally. The map uses a schematic grid we drew ourselves, not copyrighted map tiles.
- `previews/`: screenshots. `qa/` holds every page at 1440px and 390px.

## Regenerating
The page generator is in `/workspace/gta6-site-src/`. Run `python3 main.py` there to rewrite the HTML into this folder.
`app.js` and `styles.css` are edited directly in this folder.
QA scripts are in `/workspace/gta6-site-src/scripts/`.

## Before publishing
- `SITE` in `gta6-site-src/hq.py` is a guess (`https://tkaytyf.github.io/gta6-hq/`). It feeds the canonical, OG and sitemap URLs, so set it to the real URL.
- Some official images are hotlinked from rockstargames.com. They will break if Rockstar changes its site. They can be downloaded only if the usage terms allow it.
- These are placeholders until tkay provides real details: Discord, socials, newsletter, tip form, ad slots and tkay's clips.

## Content rules
Every fact links to its source. When outlets disagree, the page says so. Anything unconfirmed is marked "coming soon".
