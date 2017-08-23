/**
 * Created by YanMingDao on 11/08/2017.
 */

let sprintf = require('sprintf-js').sprintf;
let Database = require('../database/database');
let tableName = 'comment163';
let db = new Database();

class CommentDao {
    insert(data) {
        let sql = sprintf('INSERT into %1$s (title, comment, musicId) values(\"%2$s\", \"%3$s\", \"%4$s\")', tableName, data.title, data.comment, data.musicId);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    console.log('insert error in CommentDao');
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
;    }

    hasComment(comment) {
        let sql = sprintf('SELECT count(comment) as count FROM %1$s where comment=\"%2$s\"', tableName, comment);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    console.log('hasComment error in CommentDao');
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

let commentDao = new CommentDao();
module.exports = commentDao;