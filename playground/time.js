var moment = require('moment');
// var date = moment();

// // var date = new Date();
// // console.log(date.getMonth());
// date.add(1, 'years').subtract(9, 'months')
// console.log(date.format('MMM Do YYYY'));


var createdAt = 1234;
var date = moment(createdAt);
console.log(moment().valueOf());


console.log(date.format('h:m a'));
