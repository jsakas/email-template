const fs = require('fs');
const Csv = require('papaparse');
const emailData = require('./email-data.js');

fs.writeFileSync('./email-data.csv', Csv.unparse(emailData));
