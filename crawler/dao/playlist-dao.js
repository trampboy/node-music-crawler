/**
 * Created by YanMingDao on 10/08/2017.
 */

let Database = require('../database/database');
let sprintf = require('sprintf-js').sprintf;
let tableName = 'playlist163';

function PlaylistDao() {
    let db = new Database();
    // id, title, link, create_time,
    this.insert = function (data) {
        let sql = sprintf('INSERT into %1$s (title, link) values(\"%2$s\", \"%3$s\")', tableName, data.title, data.link);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    console.log('insert error in PlaylistDao');
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    this.hasTitle = function (title) {
        let sql = sprintf('SELECT COUNT(title) as count FROM %1$s WHERE title=\"%2$s\"', tableName, title);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
    };
}

module.exports = PlaylistDao;