# Promise Ngine
A promise engine to resolve async objects with concurrency and serial resolution on demand passing the result along the way.

## How to use :

Without binding to global Promise object
``` javascript
const PromiseNgine = new (require('promise-ngine'))();
```
Binding to global Promise object
``` javascript
const PromiseNgine = new (require('promise-ngine'))(true);
```

All examples will use the method binding to global Promise object.

The engine exposes two methods :

### Promise.ngine
A method resolving all ngine keys contained in an object or an array passing the result.

#### Promise.NgineKey
An engine key is constructed with a method taking three arguments as below :
``` javascript
 new Promise.NgineKey((resolve, reject, result) => {});
```

An engine key can be resolved calling the resolve method passing the result that will be mapped to
the key's original position in the object. It can also be resolved returning a Promise.

The property ```pos``` on a engine key sets the position of the Promise in the chain. 0 being first position.
``` javascript
 new Promise.NgineKey((resolve, reject, result) => {}).pos(0);
```

#### Examples
Example with a pseudo sql call and a pseudo mongo call needing result from sql :
``` javascript
Promise.ngine({
      user: {
          infos: new Promise.NgineKey((resolve, reject, result) => { // call happens first
               return db.query('select * from users where email=email@email.com') // returns a Promise
          }).pos(0),
          orders: new Promise.NgineKey((resolve, reject, result) => { // call happens second
               orders.find({id_user: result.user.infos.id})
               .then(resolve) // calls the resolve method
               .catch(reject);
          }).pos(1)
     }
})
.then(result => {
     console.log(result) // { user: { infos : {}, orders : [] } }
})
```
To have the 'orders' promise access the result of the infos promise,
the integer passed to ```.pos``` method of the orders promise must be higher than the one for the infos promise.

#### Concurrency
At the same time, you might need other data than don't need anything from the orders promise
but needs data from the infos promise. Therefore, it can run concurrently with the orders promise. This can be achieved by passing the same position as the one passed to the orders promise.

Example:
``` javascript
Promise.ngine({
      user: {
          infos: new Promise.NgineKey((resolve, reject, result) => {
               db.query('select * from users where email=email@email.com')
               .then(resolve)
               .catch(reject);
          }).pos(0),
          orders: new Promise.NgineKey((resolve, reject, result) => {
               orders.find({id_user: result.user.infos.id})
               .then(resolve)
               .catch(reject);
          }).pos(1),
          comments: new Promise.NgineKey((resolve, reject, result) => {
               comments.find({id_user: result.user.infos.id})
               .then(resolve)
               .catch(reject);
          }).pos(1)
     }
})
.then(result => {
     console.log(result) // { user: { infos : {}, orders : [], comments: [] } }
})
```

So every promise sharing the same position wherever it is in the object will run concurrently.
Therefore if a promise relies on the result of another one, they must not share the same position.

### Promise.mapAll

See https://www.npmjs.com/package/promise-to-object
