import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader
} from 'vitepress-plugin-group-icons'
import { search as zhSearch } from './zh'

export const shared = defineConfig({
  title: 'Vite',

  rewrites: {
    'zh/:rest*': ':rest*'
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  markdown: {
    math: true,
    codeTransformers: [
      // We use `[!!code` in demo to prevent transformation, here we revert it back.
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],
    config(md) {
      // TODO: remove when https://github.com/vuejs/vitepress/issues/4431 is fixed
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const { localeIndex = 'root' } = env
        const codeCopyButtonTitle = (() => {
          switch (localeIndex) {
            case 'zh':
              return '复制代码'
            default:
              return 'Copy code'
          }
        })()
        return fence(tokens, idx, options, env, self).replace(
          '<button title="Copy Code" class="copy"></button>',
          `<button title="${codeCopyButtonTitle}" class="copy"></button>`
        )
      }
      md.use(groupIconMdPlugin)
    }
  },

  sitemap: {
    hostname: 'https://vite.jnpan.top',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-logo-mini.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/vitepress-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh' }],
    ['meta', { property: 'og:title', content: 'Vite | Vite & Vue Powered Static Site Generator' }],
    ['meta', { property: 'og:site_name', content: 'Vite' }],
    ['meta', { property: 'og:image', content: 'https://vite.jnpan.top/vitepress-og.jpg' }],
    ['meta', { property: 'og:url', content: 'https://vite.jnpan.top/' }],
    ['script', { src: 'https://cdn.usefathom.com/script.js', 'data-site': 'AZBRSFGG', 'data-spa': 'auto', defer: '' }]
  ],

  themeConfig: {
    logo: { src: '/vitepress-logo-mini.svg', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jinnan11/vitepress' }
    ],

    search: {
      provider: 'algolia',
      options: {
        appId: '8J64VVRP8K',
        apiKey: '52f578a92b88ad6abde815aae2b0ad7c',
        indexName: 'vitepress',
        locales: {
          ...zhSearch
        }
      }
    },

    carbonAds: { code: 'CEBDT27Y', placement: 'vuejsorg' }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          vitepress: localIconLoader(
            import.meta.url,
            '../../public/vitepress-logo-mini.svg'
          ),
          firebase: 'logos:firebase'
        }
      })
    ]
  }
})
