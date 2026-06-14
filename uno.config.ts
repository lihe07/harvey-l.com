import presetIcons from '@unocss/preset-icons'
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      "src/**/*.{js,jsx,ts,tsx,md,mdx}",
    ],
  },
  presets: [
    presetWind3(),
    presetIcons(),
  ],
})
