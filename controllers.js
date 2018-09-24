/**
 * @file Controller 中间件
 * @author netcon
 */

import {existsSync, readdirSync} from 'fs';
import {dirname, join, resolve} from 'path';
import Router from 'koa-router';
import {
    getClassName,
    getPrefixFromClassName,
    getPrefixFromFileName,
    isModulePath
} from './utils';
import {
    createClassImportError
} from './error';

// 获取 Controller 中所有以 Action 结尾的方法名
const getActionNames = ({prototype}) => (
    Object.getOwnPropertyNames(prototype)
        .filter(name => name.endsWith('Action') && typeof prototype[name] === 'function')
);

// 处理 action
const handleAction = action => async (ctx, next) => {
    ctx.request.params = ctx.params;
    ctx.body = await action(ctx, next);
};

export const controllers = (options = {}) => {
    const dir = resolve(dirname(require.main.filename), options.path || './src/controllers');
    const router = new Router(options.router);

    // 读取 dir 路径下的文件并设置路由
    existsSync(dir) && readdirSync(dir).forEach(file => {
        const path = resolve(dir, file);

        // 仅尝试文件夹或后缀名为 .js 的文件
        if (isModulePath(path)) {
            const Controller = require(path).default || throw createClassImportError(path);
            const controller = new Controller();
            // 整个 Controller 的路由前缀
            const className = getClassName(Controller) || getPrefixFromFileName(file);
            const prefix = Controller.$$prefix ?? '/' + getPrefixFromClassName(className, 'Controller').toLowerCase();
            const definedActions = new Set();

            // 设置通过装饰器设置的路由
            controller.$$routes && controller.$$routes.forEach(({path, method, action}) => {
                definedActions.add(action);
                router[method](join(prefix, path), handleAction(action));
            });

            // 设置类中 xxxAction 方法的路由
            getActionNames(Controller).forEach(name => {
                const action = Controller.prototype[name];

                // 装饰器中已经定义的路由不再处理
                if (!definedActions.has(action)) {
                    // indexAction 可以直接映射
                    if (name === 'indexAction') {
                        router.all(prefix, handleAction(action));
                    }

                    router.all(join(prefix, name.slice(0, -6)), handleAction(action));
                }
            });
        }
    });

    return router.routes();
};
