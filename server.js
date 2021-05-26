const Koa = require('koa')
const KoaRouter = require('@koa/router')
const app = new Koa()
const router = new KoaRouter()
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 6435
const { Nuxt, Builder } = require('nuxt')

// 传入配置初始化 Nuxt.js 实例
const config = require('./nuxt.config.js')
config.dev = !isProd
const nuxt = new Nuxt(config)

async function start() {
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  router.get('/api', (ctx, next) => {
    ctx.body = '999'
  })

  app.use(router.routes())

  // 页面渲染
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

start()
