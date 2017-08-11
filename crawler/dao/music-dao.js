/**
 * Created by YanMingDao on 11/08/2017.
 */
// let music    = 'CREATE TABLE `music163` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(200) DEFAULT \'\',`song_id` int(11) DEFAULT NULL, `author` varchar(350) DEFAULT \'\',`over` varchar(5) DEFAULT \'N\',`create_time` datetime DEFAULT CURRENT_TIMESTAMP,`comment_id` int(11) DEFAULT \'0\',PRIMARY KEY (`id`),KEY `over_id` (`over`,`id`),KEY `author` (`author`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4';


let sprintf = require('sprintf-js').sprintf;
let Database = require('../database/database');
let db = new Database();
let tableName = 'music163';

class MusicDao {
    insert(data) {
        let sql = sprintf('INSERT into %1$s (name, song_id, author) values(\"%2$s\", %3$d, \"%4$s\")', tableName, data.name, data.songId, data.author);
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

    hasContain(name) {
        let sql = sprintf('SELECT COUNT(*) from %1$s where name=\"%2$s\"', tableName, name);
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
}

let musicDao = new MusicDao();

module.exports = musicDao;