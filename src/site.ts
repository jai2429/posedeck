/** Everything you are likely to change before launch lives in this file. */
export const site = {
  name: "PoseDeck",
  tagline: "Never do the same pose twice",
  description:
    "Photo pose ideas for everyone: solo, couples, families, siblings, friends, grandparents and kids. Pick a pose, follow three steps, take the photo.",
  /** Set NEXT_PUBLIC_SITE_URL in your hosting dashboard once you have a domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://posedeck.example",

  /** Monetisation switches. Both are off until you set the environment variables. */
  ads: {
    /** e.g. ca-pub-1234567890123456 */
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  },
  premium: {
    /** Set NEXT_PUBLIC_PREMIUM=on to lock poses marked `premium: true`. */
    enabled: process.env.NEXT_PUBLIC_PREMIUM === "on",
  },
};
