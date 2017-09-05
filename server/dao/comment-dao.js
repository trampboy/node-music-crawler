/**
 * Created by YanMingDao on 05/09/2017.
 */

let db = require('../db/database');
let sprintf = require('sprintf-js').sprintf;

class CommentDao {
    getComments(page = 0, per_page = 100) {
        let sql = sprintf('select c.id as comment_id, c.txt as comment, c.music_id as music_id, m.name as music, m.author as author from comment163 as c join music163 as m on c.music_id = m.song_id limit %1$d %2$d', page * per_page, (page + 1) * per_page);
        return new Promise(function (resolve, reject) {
            db.query(sql, function (error, results) {
                if (error) {
                    console.log('getComments error in CommentDao');
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

let commentDao = new CommentDao();
module.exports = commentDao;