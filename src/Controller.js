/**
 * @file Controller 的基类，继承于此可使用一些公用方法
 * @author netcon
 */

class Controller {
    normalize(data, errcode, errmsg) {
        return {data, errcode, errmsg};
    }
}

export default Controller;
