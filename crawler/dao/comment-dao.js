/**
 * Created by YanMingDao on 11/08/2017.
 */

let sprintf = require('sprintf-js').sprintf;
let Database = require('../database/database');
let tableName = 'comment163';
let db = new Database();
let stringUtil = require('../utils/string-util');

class CommentDao {
    insert(data) {
        let sql = sprintf('INSERT into %1$s (txt, music_id, author) values(\"%2$s\", \"%3$s\", \"%4$s\")', tableName, stringUtil.trim(data.comment), data.musicId, data.author);
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
        let sql = sprintf('SELECT count(txt) as count FROM %1$s where txt=\"%2$s\"', tableName, stringUtil.trim(comment));
        return new Promise(function (resolve, reject) {
            db.query(sql, function (err, result) {
                if (err) {
                    console.log('hasComment error in CommentDao');
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
    }
}

let commentDao = new CommentDao();
module.exports = commentDao;