/**
 * @file 导出 TypeORM
 * @author netcon
 */

const orm = require('typeorm');

module.exports = orm.default || orm;
