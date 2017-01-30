'use strict';

console.time("traverse");
const PromiseNgine = new (require('promise-ngine'))(true);

/*
Will traverse the whole directory asynchronously resolving with a
representation as such :
{
   path: '.',
    dir: {
        files : [],
        subdir : {
            path : './subdir',
            files : [],
            subdir : {
                path : './subdir',
                files: []
            }
        },
        subdir2 : {
            path : './subdir',
            files : [],
            subdir : {
                path : './subdir',
                files: []
            }
        }
    }
 }
* It cannot be done copying original object
* as the traversal happens only once and the copy is done while traversing
* so the starting result is empty
*/

let traverse = new Promise.NgineKey((resolve, reject, result) => {
    if (result.path) {
        fs.readdir(result.path, (err, data) => {
            if (err) reject(err);
            if (data) {
                result.dir = {};
                result.dir.files = []
                    Promise.all(data.reduce((agg, file) => {
                        if (file !== 'files' && fs.statSync(result.path + '/' + file).isDirectory()) {
                            result.dir[file] = {
                                path: result.path + '/' + file,
                                dir: traverse
                            };
                            agg.push(Promise.ngine(result.dir[file]));
                        } else if (fs.statSync(result.path + '/' + file).isFile()) {
                            result.dir.files.push(file);
                        }
                        return agg;
                    }, []))
                    .then(() => {
                        resolve(result.dir);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                resolve(data);
            }
        });
    } else {
        resolve(result);
    }
}).pos(0);

Promise.ngine({
    path: '.',
    dir : traverse
})
.then(result => {
    console.log(result);
    console.timeEnd("traverse");
})
.catch(error => {
    console.log(error);
});
