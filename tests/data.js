const path = require('path');
const dataDir = path.resolve(__dirname, '../data');
const fs = require('fs-extra');
const parser = require('../tools/parser.js');
// console.log(Object.keys(fs).forEach(i => console.log(i)))
function translateFiles(){
    const csvFiles = fs.readdirSync(dataDir);
    const tmpDir = path.join(__dirname, 'tmp')
    fs.ensureDir(tmpDir);
    const promises = csvFiles.
        filter(file => /.csv$/.test(file)).
        map(file => parser(path.join(dataDir, file), path.join(tmpDir, `${file}.json`)));
    return Promise.all(promises);
}

function diagonallNull(data){
    Object.keys(data).forEach(station => {
        if (data[station][station]!==0) {
            throw `${station} ${data[station][station]}`
        }
    })
}
function nonDiagonallNull(data){
    Object.keys(data).forEach(station => Object.keys(data[station]).forEach(dest => {
        if (station!==dest&&data[station][dest]==0) {
            throw `${station} ${dest} ${data[station][dest]}`
        }
    }));
}
function isSorted(array){
    return array.every((val, i, arr) => !i || (val >= arr[i - 1]));
}
function isSortedReverse(array){
    return array.every((val, i, arr) => !i || (val <= arr[i - 1]));
}

function vectorAdequate(data){
    Object.keys(data).forEach(station => {
        const time = Object.keys(data[station]).map(dest => data[station][dest]);
        const zeroIndex = time.findIndex(num => num===0);
        const leftArray = time.splice(0, zeroIndex);
        if(!isSortedReverse(leftArray)) {
            throw `leftArray ${leftArray.join(' ')}`;
        }
        const rightArray = time.splice(1);
        if(!isSorted(rightArray)) {
            throw `right ${rightArray.join(' ')}`;
        }
    });
}

async function test(){
    const files = await translateFiles();
    files.forEach(file => {
        const data = require(file);
        console.log('test')
        diagonallNull(data);
        nonDiagonallNull(data);
        vectorAdequate(data);
    })
}

test()