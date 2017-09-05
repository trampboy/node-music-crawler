/**
 * Created by YanMingDao on 05/09/2017.
 */

// TODO 考虑和crawler/database之间的关系
let mysql = require('mysql');

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'music_crawler'
});

class DataBase {
    query(sql, callback) {
        connection.query(sql, function (error, result) {
            if (error) {
                console.log('query error:' + error + ', result:' + result);
            }

            if (!callback) {
                return;
            }

            callback(error, result);
        });
    }
}

let db = new DataBase();
module.exports = db;




