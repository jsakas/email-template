const fs = require('fs');
const Csv = require('papaparse');

const file = fs.createReadStream('./email-data.csv', {
    encoding: 'utf-8',
});

Csv.parse(file, {
    download: true,
    header: true,
    worker: true,
    complete: function(results) {
        console.log(results.data);
        fs.writeFileSync('./email-data.json', JSON.stringify(results.data, null, '  '));
    }
});
