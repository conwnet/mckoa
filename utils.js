/**
 * @file 工具函数
 * @author netcon
 */

// 获取类名（处理 export default 导出的匿名类）
export const getClassName = Class => Class.name?.charAt(0) !== '_' ? Class.name : '';

// 根据类名获取前缀
export const getPrefixFromClassName = (name, suffix = '') => (
    (suffix && name.endsWith(suffix)) ? name.slice(0, -suffix.length) : name
);

// 根据文件名获取前缀
export const getPrefixFromFileName = name => (
    name.endsWith('.js') ? name.slice(0, -3) : name
);

// 是否是可以导入的模块
export const isModulePath = file => file.endsWith('.js') || statSync(file).isDirectory();
