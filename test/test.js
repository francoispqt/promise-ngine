'use strict';

const assert = require('assert');
const PromiseNgine = new (require('../index'))(true);

/* TEST BASIC USAGE */
Promise.ngine({
    finalStr: "",
    first: 1,
    second: new Promise.NgineKey(function(resolve, reject) {
            this.finalStr += "2";
            resolve(this.finalStr);
    }).pos(2),
    third: new Promise.NgineKey((resolve, reject, result) => {
            result.finalStr += "0";
            resolve(result.finalStr);
    }).pos(0),
    nested: {
        sub: new Promise.NgineKey((resolve, reject, result) => {
            result.finalStr += "1";
            resolve(result.finalStr);
        }).pos(1),
        sub1: {
            sub2: 'test',
            sub3: {
                sub4: 'test4',
                sub5: new Promise.NgineKey((resolve, reject, result) => {
                    result.finalStr += "1";
                    resolve(result.finalStr);
                }).pos(1)
            }
        }
    },
    nested2: {
        sub: new Promise.NgineKey((resolve, reject, result) => {
            result.finalStr += "1";
            resolve(result.finalStr);
        }).pos(1),
        sub2: {
            sub3: new Promise.NgineKey((resolve, reject, result) => {
                result.finalStr += "2";
                resolve(result.finalStr);
            }).pos(2)
        }
    },
    nested3: new Promise.NgineKey((resolve, reject, result) => {
        Promise.all([
            Promise.resolve(0),
            Promise.resolve(1)
        ])
        .then(result => {
            result.finalStr += "1";
            resolve(result.finalStr);
        })
        .catch(error => {
            reject(error);
        })
    }).pos(1)
})
.then(result => {
    console.log('-- result Basic test :');
    console.log(result.finalStr);
    assert(result.finalStr === "011122");
    console.log("----------------------");
    console.log("\\o/ Basic test is successful.");
    console.log("----------------------");
})
.catch(error => {
    console.log(error);
    console.log("----------------------");
    console.log(":'( Basic test has failed.");
    console.log("----------------------");
    process.exit(1);
});


/* TEST ASYNCHRONICITY */
Promise.ngine({
    test1: new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 3000)
    }).pos(0),
    test2: new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 3000)
    }).pos(0)
})
.then(result => {
    console.log('-- result Asynchronicity test :')
    console.log(result);
    assert(result.test1 === result.test2);
    console.log("----------------------");
    console.log("\\o/ Asynchronicity test is successful.");
    console.log("----------------------");
})
.catch(error => {
    console.error(error);
    console.log("----------------------");
    console.log(":'( Asynchronicity test has failed.");
    console.log("----------------------");
    process.exit(1);
});

/* COPY TEST */
let original = {
    test0: 1,
    test1: new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(0),
    test2: new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(0),
    test3: new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(0),
    testNested: {
        testNested1: 1,
        testNested2: 2,
        testNested3: {
            testNested: 1
        }
    },
    testArray: [1, 2],
};

Promise.ngine(original, { copy: true })
.then(result => {
    console.log('-- result copy test :')
    console.log(result);
    assert(original !== result);
    console.log("----------------------");
    console.log("\\o/ copy test is successful.");
    console.log("----------------------");
})
.catch(error => {
    console.error(error);
    console.log("----------------------");
    console.log(":'( copy test has failed.");
    console.log("----------------------");
    process.exit(1);
});

/* TEST ARRAY */
Promise.ngine([
    new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(0),
    {
        test: new Promise.NgineKey((resolve, reject, result) => {
            setTimeout(() => resolve(Date.now()), 2000)
        }).pos(0),
        test2: new Promise.NgineKey((resolve, reject, result) => {
            setTimeout(() => resolve(Date.now()), 2000)
        }).pos(1)
    },
    new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(2),
])
.then(result => {
    console.log('-- result array test :')
    console.log(result);
    assert(
        result[0] === result[1].test &&
        result[1].test < result[1].test2 &&
        result[1].test2 < result[2]
    );
    console.log("----------------------");
    console.log("\\o/ array test is successful.");
    console.log("----------------------");
})
.catch(error => {
    console.error(error);
    console.log("----------------------");
    console.log(":'( array test has failed.");
    console.log("----------------------");
    process.exit(1);
});

/* TEST ARRAY COPY */
let originalArray = [
    new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(0),
    {
        test: new Promise.NgineKey((resolve, reject, result) => {
            setTimeout(() => resolve(Date.now()), 2000)
        }).pos(0),
        test2: new Promise.NgineKey((resolve, reject, result) => {
            setTimeout(() => resolve(Date.now()), 2000)
        }).pos(1)
    },
    new Promise.NgineKey((resolve, reject, result) => {
        setTimeout(() => resolve(Date.now()), 2000)
    }).pos(2),
];

Promise.ngine(originalArray, { copy: true })
.then(result => {
    console.log('-- result array copy test :')
    console.log(result);
    assert(
        result[0] === result[1].test &&
        result[1].test < result[1].test2 &&
        result[1].test2 < result[2]
    );
    assert(result !== originalArray);
    console.log("----------------------");
    console.log("\\o/ array copy test is successful.");
    console.log("----------------------");
})
.catch(error => {
    console.error(error);
    console.log("----------------------");
    console.log(":'( array copy test has failed.");
    console.log("----------------------");
    process.exit(1);
});
