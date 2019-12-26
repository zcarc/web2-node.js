const args = process.argv;

console.log('args: ', args);

// console.log(args[2]);

if(args[2] === '777') {
    console.log(true);
} else {
    console.log(false);
}