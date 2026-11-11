# PoseDeck

Photo pose ideas for everyone: solo, couples, family, siblings, friends, older couples, kids, and parent and child. Each pose has an illustration, three steps, and a tip for the person holding the camera.

Built with Next.js (App Router) and TypeScript. No database and no API keys are needed to run it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Publish it (Vercel, free tier)

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New > Project**, pick the repository and press **Deploy**. No settings need changing.
3. When you have a domain, add it under **Project > Domains**, then set the environment variable `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com` and redeploy. The sitemap and share links use it.

The site is installable on phones (Add to Home Screen) through the web manifest.

## Where things are

| Path | What it holds |
| --- | --- |
| `src/site.ts` | Name, tagline, description, monetisation switches. Rename the product here. |
| `src/core/poses.ts` | The pose library. Add, edit or remove poses here. |
| `src/core/stances.ts` | Reusable body positions (joint angles) that poses are built from. |
| `src/core/categories.ts` | The eight groups, their colours, and which four show on the home page (`featured`). |
| `src/core/figure.ts` | The drawing engine that turns stances into shapes. |
| `src/core/search.ts` | Search, including synonyms such as "old" leading to older couples. |
| `src/app` | Pages: home, `/c/[who]`, `/pose/[slug]`, `/search`, `/saved`. |
| `src/components` | Cards, buttons, the advert slot. |

## Add a pose

Add an object to `POSES` in `src/core/poses.ts`:

```ts
{
  slug: "my-new-pose", title: "My new pose", who: "couples", moods: ["playful"], level: 1,
  figures: [f("wave", 0), f("hip", 70, { flip: true, tone: "b", hair: "long" })],
  blurb: "One line that sells it.",
  steps: ["First.", "Second.", "Third."],
  shot: "Advice for the photographer.",
  keywords: ["words", "people", "search"],
}
```

`f(stance, x, options)` places a figure. `x` is the horizontal position in body units (two adults standing side by side are about 55 to 95 apart). Options: `flip`, `s` (size, children use `K`), `kid`, `tone` (`"a"` or `"b"`), `hair` (`bun`, `long`, `bob`, `cap`), `dress`, `cane`, `phone`, `lift`. Figures are scaled to fit the card automatically.

Run `npm run sheet` to draw every pose into `contact-sheet.png` so you can check new ones at a glance.

## Monetisation (off by default)

- **Ads.** Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXX`. The AdSense script loads and every `<AdSlot slot="..."/>` starts rendering. Slots are already placed on the home, category and pose pages. Replace each `slot` value with the ad unit ID from your AdSense account.
- **Premium poses.** Set `NEXT_PUBLIC_PREMIUM=on`. Poses marked `premium: true` get a Pro badge and their steps are replaced by an upgrade panel. Accounts and payments are not built yet; wire your provider (Razorpay, Stripe) into the `locked` branch in `src/app/pose/[slug]/page.tsx`.

## Native app later

`src/core` has no React or browser imports. `buildScene()` returns plain shapes (lines, circles, polygons, rectangles), so an Expo app can import the same folder and draw them with `react-native-svg`. `src/components/PoseArt.tsx` is the 40-line web version to copy from.

## Before a public launch

- Check that the name PoseDeck is free to use (trademark and domain) or change it in `src/site.ts` and the logo in `src/app/layout.tsx`.
- Add a privacy policy page. AdSense requires one.
- Run `npm run icons` after changing colours or the icon pose.
