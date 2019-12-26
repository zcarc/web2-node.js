const fs = require('fs');


// console.log('A');
// const result = fs.readFileSync('./sync.txt', 'utf8');
// console.log(result);
// console.log('C');

console.log('A');
fs.readFile('./sync.txt', 'utf8', (err, result) => {
    console.log(result);
});
console.log('C');