import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://livediscover-triangle-nights.webking105.chatgpt.site',
  outDir: '../../dist',
  devToolbar: { enabled: false },
  integrations: [preact(), sitemap({ filter: (url) => !/\/(saved|studio|styleguide|rsvp)(\/|$)/.test(url) })],
  vite: { plugins: [tailwindcss()] },
});
