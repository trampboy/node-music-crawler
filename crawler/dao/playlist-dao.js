/**
 * Created by YanMingDao on 10/08/2017.
 */

let Database = require('../database/database');
let sprintf = require('sprintf-js').sprintf;
let tableName = 'playlist163';
let db = new Database();

class PlaylistDao {
    insert(data) {
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
    }

    hasTitle(title) {
        let sql = sprintf('SELECT COUNT(title) as count FROM %1$s WHERE title=\"%2$s\"', tableName, title);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0].count > 0);
                }
            });
        });
    }

    getAll() {
        let sql = sprintf('SELECT * from %1$s ', tableName);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

let playListDao = new PlaylistDao();
module.exports = playListDao;