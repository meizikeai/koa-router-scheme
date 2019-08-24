koa-router-scheme
===

Router Scheme middleware for Koa

## Installation

[https://npmjs.org/package/koa-router-scheme](https://npmjs.org/package/koa-router-scheme)

```bash
$ npm install koa-router-scheme
```

## Usage

```javascript
const Koa = require('koa')
const routerScheme = require('koa-router-scheme')

const app = new Koa()

// router
app.use(routerScheme({ app, paths: '../../server/routers' }))

app.listen(10010)
```

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)