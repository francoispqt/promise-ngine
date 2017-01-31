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
                let ret = this.closure(resolve, reject, source);
                if (ret && ret.then) {
                    ret.then(result => {
                        target[k] = result;
                        return resolve(target);
                    })
                    .catch(reject);
                } else {
                    return ret;
                }
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
