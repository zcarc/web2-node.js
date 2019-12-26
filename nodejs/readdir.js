
const fs = require('fs');
const dataDir = '../data';

console.log('dataDir: ', dataDir);

fs.readdir(dataDir, (err, fileList) => {
    if(err){
        console.log(err);
    }
    console.log('fileList: ', fileList);
});