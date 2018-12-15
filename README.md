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
const Router = require('koa-router')
const scheme = require('koa-router-scheme')

const app = new Koa()
const router = new Router()

// router
app.use(scheme())

app.listen(10010)
```

## Options
```javascript
// defaults
// const defaults = {
//   controller: '../../servers/controller',
//   root: '../../',
//   routers: '../../servers/routers',
//   models: '../../servers/models',
// }
```

```
servers
├── controller            // 处理业务流程
│    ├── common.js               
│    └── other.js
├── models                // 通用业务组件
│    ├── common.js
│    └── other.js
└── routers               // 路由入口文件
     ├── common.js
     └── other.js
```

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)