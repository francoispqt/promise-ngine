'use strict';

class PromiseNgine {
    constructor(install){
        this.mapAll = require('promise-to-object');
        this.ngine = require('./ngine');
        this.NgineKey = require('./ngine-key');
        if (install) this.install();
        return global.Promise;
    }

    install(){
        Object.keys(this)
        .forEach(k => {
            if (k !== "install") {
                global.Promise[k] = this[k];
            }
        });
    }
};

module.exports = PromiseNgine;
