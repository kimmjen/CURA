import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Strip VitePWA from the Storybook build — the storybook runtime
    // ships a 3 MB chunk that blows past workbox's default 2 MB precache
    // limit, and Storybook doesn't need to be a PWA.
    const stripPwa = (plugin: unknown): boolean => {
      if (Array.isArray(plugin)) return plugin.some(stripPwa);
      const name = (plugin as { name?: string } | undefined)?.name;
      return !!name && name.includes('pwa');
    };
    if (config.plugins) {
      config.plugins = config.plugins.filter((p) => !stripPwa(p));
    }
    return config;
  },
};
export default config;