'use strict';

const runGenerator = function(g) {
    var it = g(), ret;
    let cter = 0;
    return new Promise((resolve, reject) => {
        (function iterate(val){
            ret = it.next();
            cter++;
            if (!ret.done) {
                if (ret.value && ret.value.then) {
                    ret.value.then(iterate)
                    .catch(error => reject(error));
                } else {
                    iterate();
                }
            } else {
                return resolve();
            }
        })()
    });
};

function *clsGenerator(closures) {
    for (let i = 0; i < closures.length; i++) {
        if (closures[i] instanceof Array) {
            yield Promise.all(closures[i].map(cls => cls()));
        } else {
            yield closures[i]();
        }
    }
};

const promiseClosureNgine = function(closures){
    return runGenerator(clsGenerator.bind(null, closures));
};

module.exports = promiseClosureNgine;
