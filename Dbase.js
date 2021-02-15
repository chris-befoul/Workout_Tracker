var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs290_hardisoc',
    password        : '8661',
    database        : 'cs290_hardisoc'
});

module.exports.pool = pool;
