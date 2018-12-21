const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

const loader = dir => require(dir)

module.exports = (app, config) => {
  if (typeof app !== 'object') {
    throw new Error(`'app' object is not callable`)
  }

  // Merge configuration
  const defaults = {
    controller: '../../server/controller',
    root: '../../',
    routers: '../../server/router',
    models: '../../server/model',
  }
  const options = Object.assign({}, defaults, config || {})

  app.controller = {}
  app.router = new Router()

  // Router - callback
  const controllers = folder(path.join(__dirname, options.controller))
  controllers.forEach(crl => {
    app.controller[crl.name] = loader(crl.module)
  })

  // Router - handle
  const routers = {}
  const route = folder(path.join(__dirname, options.routers))
  route.forEach(crl => {
    Object.assign(routers, loader(crl.module)(app))
  })

  // Public Service
  const models = {}
  const work = folder(path.join(__dirname, options.models))
  work.forEach(crl => {
    models[crl.name] = loader(crl.module)
  })

  Object.keys(routers).forEach(key => {
    const [method, path] = key.split(' ')
    app.router[method](path, async (ctx, next) => {
      const handler = routers[key]
      await handler(ctx, next, { models })
    })
  })

  return app.router.routes()
}

/**
 * checkDirectory
 * @param {String} dir path
 */
function checkDirectory (dir) {
  let result = false
  try {
    const stat = fs.statSync(dir)
    if (stat && stat.isDirectory()) {
      result = true
    }
  } catch (err) {
    console.error(`"${dir}" is not a directory!`)
  }
  return result
}

/**
 * get file
 * @param {String} dir path
 */
function folder (dir) {
  let [list, result] = [[], []]

  const stat = checkDirectory(dir)
  if (stat) {
    list = fs.readdirSync(dir)
  }

  list.forEach(name => {
    const file = path.join(dir, name)
    const stat = checkDirectory(file)
    if (stat) {
      result = result.concat(folder(file))
    } else {
      result.push({ name: name.split('.')[0], module: file })
    }
  })

  return result
}
