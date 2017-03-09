const _ = require('lodash');

function add(x, y){
	return x + y;
}

console.log(add(3, 5));
const add5 = _.curry(add)(5);
console.log('')
console.log('Type of Add5', typeof add5);
console.log('add5(3)', add5(3));

const curriedAdd = _.curry(add);
console.log('curriedAdd(4)(7)', curriedAdd(4)(7));
console.log('curriedAdd(4, 7)', curriedAdd(4, 7));
console.log('curriedAdd()(4, 7)', curriedAdd()(4, 7));
console.log('curriedAdd()()(4, 7)', curriedAdd()()(4, 7));