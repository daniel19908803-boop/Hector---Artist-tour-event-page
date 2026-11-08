import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const site = process.env.PUBLIC_SITE_URL || (vercelHost
  ? `https://${vercelHost}`
  : 'https://livediscover-triangle-nights.webking105.chatgpt.site');

export default defineConfig({
  site,
  outDir: '../../dist',
  devToolbar: { enabled: false },
  integrations: [preact(), sitemap({ filter: (url) => !/\/(saved|studio|styleguide|rsvp)(\/|$)/.test(url) })],
  vite: { plugins: [tailwindcss()] },
});
