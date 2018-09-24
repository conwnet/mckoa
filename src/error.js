/**
 * @file 异常定义
 * @author netcon
 */

// 无法从指定路径引入类
export const createClassImportError = path => new Error(`Can not import a class from ${path}`);