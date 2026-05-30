import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { incrementVisits } from './server/counter.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function counterApiPlugin(env) {
  return {
    name: 'counter-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/counter') {
          next()
          return
        }

        try {
          const metrics = await incrementVisits(env, {
            referrer: req.headers['x-referrer'] ?? req.headers.referer ?? '',
            host: req.headers.host ?? '',
          })
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(metrics))
        } catch (error) {
          console.error('Redis Error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            total: '---',
            weekly: { current: 0, previous: 0, changePct: null },
            monthly: { current: 0, previous: 0, changePct: null },
            sparkline: [],
            referrers: [],
          }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')

  return {
    plugins: [react(), tailwindcss(), counterApiPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})