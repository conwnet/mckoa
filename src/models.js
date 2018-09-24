/**
 * @file Entity 中间件
 * @author netcon
 */

import {existsSync, readdirSync, statSync} from 'fs';
import {dirname, isAbsolute, join, resolve} from 'path';
import {createConnection} from 'typeorm';
import {
    getClassName,
    getPrefixFromClassName,
    getPrefixFromFileName,
    isModulePath
} from './utils';
import {
    createClassImportError
} from './error';

const models = async (options = {}) => {
    const dir = resolve(dirname(require.main.filename), options.path || './src/models');
    const entities = [], names = [], models = {};

    existsSync(dir) && readdirSync(dir).forEach(file => {
        const path = resolve(dir, file);

        // 仅尝试文件夹或后缀名为 .js 的文件
        if (isModulePath(path)) {
            const Entity = require(path).default || throw createClassImportError(path);
            const className = getClassName(Entity) || getPrefixFromFileName(file);
            const name = getPrefixFromClassName(className, 'Model');

            entities.push(Entity);
            names.push(name);
        }
    });

    const connection = await createConnection({...options, entities});

    entities.forEach((Entity, index) => {
        models[names[index]] = connection.getRepository(Entity);
    });

    return async (ctx, next) => {
        ctx.models = models;
        await next();
    };
};

export default models;
