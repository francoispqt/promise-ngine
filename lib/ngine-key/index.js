'use strict';

class NgineKey {
    constructor(closure){
        this.closure = closure;
    };

    pos(index){
        this.pos = index;
        return this;
    }

    resolve(source, k, target){
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                return this.closure(resolve, reject, source);
            })
            .then(result => {
                target[k] = result;
                return resolve(target);
            })
            .catch(error => reject(error));
        });
    }
}

module.exports = NgineKey;
