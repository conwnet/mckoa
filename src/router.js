/**
 * @file 装饰器
 * @author netcon
 */

/**
 * Controller 路由装饰器
 * @param {Array} methods HTTP 方法列表
 */
const createRouter = methods => {
    const router = {
        prefix: prefix => Class => {
            Class.$$prefix = prefix;
        }
    };

    methods.forEach(method => {
        router[method] = path => (target, property) => {
            if (!target.$$routes) {
                target.$$routes = [];
            }

            target.$$routes.push({
                path,
                method: method,
                action: target[property]
            });
        }
    });

    return router;
};

export default createRouter(['get', 'post', 'put', 'delete', 'all']);
