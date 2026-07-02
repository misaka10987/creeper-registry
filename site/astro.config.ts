// @ts-check
import { defineConfig } from 'astro/config'

import starlight from '@astrojs/starlight'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  integrations: [
    starlight({
      title: 'Creeper Registry',
      customCss: ['katex/dist/katex.min.css'],
    }),
  ],
})
