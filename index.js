const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const logger = require('bd-logger')

const loader = dir => require(dir)

module.exports = (app, config) => {
  if (typeof app !== 'object') {
    throw new Error(`'app' object is not callable`)
  }

  // 合并配置
  const defaults = {
    controller: '../../servers/controller',
    root: '../../',
    routers: '../../servers/routers',
    service: '../../servers/service',
  }
  const options = Object.assign({}, defaults, config || {})

  app.controller = {}
  app.router = new Router()

  // 路由 - 回调方法
  const controllers = folder(path.join(__dirname, options.controller))
  controllers.forEach(crl => {
    app.controller[crl.name] = loader(crl.module)
  })

  // 路由 - 集中处理
  const routers = {}
  const route = folder(path.join(__dirname, options.routers))
  route.forEach(crl => {
    Object.assign(routers, loader(crl.module)(app))
  })

  // 公共服务
  const service = {}
  const work = folder(path.join(__dirname, options.service))
  work.forEach(crl => {
    service[crl.name] = loader(crl.module)
  })

  const root = path.join(__dirname, options.root)
  Object.keys(routers).forEach(key => {
    const [method, path] = key.split(' ')
    app.router[method](path, async (ctx, next) => {
      const handler = routers[key]
      await handler(ctx, next, { logger: logger({ root }), service })
    })
  })

  return app.router.routes()
}

/**
 * 获取文件集
 * @param {String} dir path
 */
function folder (dir) {
  let result = []
  const list = fs.readdirSync(dir)
  list.forEach(name => {
    const file = path.join(dir, name)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      result = result.concat(folder(file))
    } else {
      result.push({ name: name.split('.')[0], module: file })
    }
  })

  return result
}
