'use strict';

const NgineKey = require('../ngine-key');
const promiseClosureNgine = require('./promise-closure-ngine');

const extract = (source, subsource, target, map = []) => {
    return Object.keys(subsource)
    .reduce((agg, k) => {
        if (subsource.hasOwnProperty(k)) {
            if (subsource[k] instanceof NgineKey){
                if (map[subsource[k].pos || 0]) {
                    if (map[subsource[k].pos || 0] instanceof Array) {
                        map[subsource[k].pos].push(
                            subsource[k]
                            .resolve
                            .bind(subsource[k], source, k, target)
                        );
                    } else {
                        map[subsource[k].pos || 0] =
                            [map[subsource[k].pos]]
                            .concat(
                                subsource[k]
                                .resolve
                                .bind(subsource[k], source, k, target)
                            );
                    }
                } else {
                    map[subsource[k].pos || 0] =
                        subsource[k]
                        .resolve
                        .bind(subsource[k], source, k, target)
                }
            } else if (typeof subsource[k] === 'object'){
                target[k] = target[k] || (subsource[k] instanceof Array ? [] : {});
                extract(source, subsource[k], target[k], map);
            } else {
                target[k] = subsource[k];
            }
        }
        return map;
    }, []);
};

const engine = function(object, opts){
    if (!object || typeof object !== 'object') {
        throw new Error('first arg must be an object or an array.');
    }
    opts = opts || {};
    var keys = Object.keys(object);
    var target;
    if (opts.copy) {
        target = object instanceof Array ? [] : {};
    } else {
        target = object;
    }
    return new Promise((resolve, reject) => {
        promiseClosureNgine(extract(object, object, target, []))
        .then(() => {
            resolve(target);
        })
        .catch(reject)
    });
};

module.exports = engine;
