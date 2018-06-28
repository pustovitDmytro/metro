const parse = require('csv-parse');
const fs = require('fs');

module.exports = function(src, dst){
    return new Promise((resolve, reject) => {
        const parser = parse({ delimiter: ';' }, (err, data) => {
            if (err) {
                reject(err)
            }
            const [headers, ...paylaod] = data;
            const obj = paylaod.reduce((station, item) => {
                station[item[0]] = headers.reduce((prev, name, index) => {
                    if(name) {
                        prev[name] = Number(item[index])
                    }
                    return prev;
                }, {});
                return station
            }, {})

            fs.writeFile(dst, JSON.stringify(obj), err => {
                if(err) {
                    return reject(err);
                }
                return resolve(dst);
            });
        });

        fs.createReadStream(src).pipe(parser);
    })
}