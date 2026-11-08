import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',fullyParallel:true,timeout:30000,
 use:{baseURL:'http://127.0.0.1:4321',channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',trace:'retain-on-failure'},
 projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
 webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:4321',reuseExistingServer:!process.env.CI},
});
