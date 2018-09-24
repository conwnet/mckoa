# mckoa

mckoa 是一个简单的 Koa 框架，使用它你可以用最新的 JavaScript 语法编写 Restful API。

## 安装

~~~
➜ npm -S install koa mckoa
~~~

## 使用 controllers 中间件

### 目录结构

~~~
├── app.js
└── src
    └── controllers
        └── App.js
~~~

* app.js

此文件是入口文件，需要使用当前系统安装的 Node.js 支持的语法

~~~
const Koa = require('koa');
const mckoa = require('mckoa');

(async () => {
    const app = new Koa();

    app.use(await mckoa.controllers());

    app.listen(3000);

    console.log('Serving HTTP on 0.0.0.0 port 3000 ...');
})();
~~~

* src/controllers/App.js

最简方式实现一个 Controller。

~~~
class App {
    indexAction() {
        return 'hello mckoa';
    }
}

export default App;
~~~

### 路由规则

* 可以使用 @router.prefix 装饰器为 Controller 指定路由前缀。

* 若未使用 @router.prefix 装饰器指定，将使用 Controller 类名小写定义此 Controller 路由前缀（$prefix），在本例中就是 `/app`。

* 可以使用 @router.get、@router.post、@router.put、@router.delete、@router.all 装饰器为此 Controller 中的某个方法指定路由路径（$path），修饰后此方法将作为 action 使用。

* 若未使用 @router.get、@router.post 等装饰器指定，且当类中的某个方法名为 `xxxAction` 时，若 `xxx` 未与装饰器定义的路由冲突，则此方法作为 action 使用，使用 `xxx` 作为此 action 的路由路径（$path）。

* 若装饰器中的某个方法作为 action 使用，将接收 Koa 中间件中的 ctx、next 作为函数参数

* 某个 action 的最终路由为 `$prefix/$path`。

* 名为 `indexAction` 类方法额外产生一条 `$prefix` 的路由

### 查看效果

~~~
➜ node app.js
~~~

控制台输出 `Serving HTTP on 0.0.0.0 port 3000 ...` 后，打开浏览器访问 `http://localhost:3000/app`，显示 `hello mckoa`。

（根据上述路由规则，访问 `http://localhost:3000/app/index` 效果相同）

### 稍微复杂一点儿的控制器

* src/controllers/User.js

~~~
import {router} from 'mckoa';

const {prefix, get} = router;

@prefix('/users')
class User {
    queryUser(id) {
        const username = 'robot-' + id;

        return Promise.resolve({id, username});
    }

    @get('/query/:id')
    async getUserById({request}) {
        const user = await this.queryUser(request.params.id);

        return {
            data: user,
            errcode: 0,
            errmsg: 'OK'
        };
    }

    async queryAllAction() {
        const users = await Promise.all([
            this.queryUser(1),
            this.queryUser(2),
            this.queryUser(3)
        ]);

        return {
            data: users,
            errcode: 0,
            errmsg: 'OK'
        };
    }
}

export default User;
~~~

浏览器访问 `http://localhost:3000/users/query/5`，返回：

~~~
{
    "data": {
        "id": "5",
        "username": "robot-5"
    },
    "errcode": 0,
    "errmsg": "OK"
}
~~~

浏览器访问 `http://localhost:3000/users/queryAll`，返回：

~~~
{
    "data": [
        {
            "id": 1,
            "username": "robot-1"
        },
        {
            "id": 2,
            "username": "robot-2"
        },
        {
            "id": 3,
            "username": "robot-3"
        }
    ],
    "errcode": 0,
    "errmsg": "OK"
}
~~~
