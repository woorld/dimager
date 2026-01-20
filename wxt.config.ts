import { defineConfig } from 'wxt';
import { discordImageUrl } from './src/constants';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    host_permissions: [ discordImageUrl ],
    permissions: [
      'downloads',
      'tabs',
    ],
  },
});
