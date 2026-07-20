import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'node:fs'
import path from 'node:path'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) {
    const titleMatch = raw.match(/^#\s+(.+)$/m)
    return { meta: { title: titleMatch ? titleMatch[1] : '' } }
  }
  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':')
    if (key) frontmatter[key.trim()] = rest.join(':').trim()
  })
  if (!frontmatter.title) {
    const titleMatch = match[2].match(/^#\s+(.+)$/m)
    if (titleMatch) frontmatter.title = titleMatch[1]
  }
  return { meta: frontmatter }
}

function articleMetaPlugin() {
  const virtualModuleId = 'virtual:articles-meta'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'vite-plugin-article-meta',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const articlesDir = path.resolve(__dirname, 'articles')
        const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'))
        const metaList = []
        
        files.forEach(file => {
          const content = fs.readFileSync(path.join(articlesDir, file), 'utf-8')
          const { meta } = parseFrontmatter(content)
          metaList.push({
            slug: file.replace('.md', ''),
            title: meta.title || file.replace('.md', ''),
            date: meta.date || ''
          })
        })
        
        return `export default ${JSON.stringify(metaList)}`
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('md-')
        }
      }
    }),
    vueDevTools(),
    articleMetaPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
