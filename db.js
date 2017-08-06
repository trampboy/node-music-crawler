let mysql = require('mysql');

let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
});

function init() {
	connection.connect(function(err) {
		if (err) {
			console.log('error connecting: ' + err.stack);
			return false;
		}
		return true;
	});
	
	createDatabase();
	createTables();
	close();
}

function createDatabase() {
	let database = 'CREATE DATABASE music_crawler';
	query(database);
	console.log('create database success');
}

function query(sql, cb) {
	connection.query(sql, function(error, results, fields){
        console.log('fields:' + fields + 'results:' + results);

        if (cb === undefined) {
            return;
        }

		cb(error, results, fields);
	});
}

function createTables() {
	let dropdbs  = ['drop table if exists playlist163','drop table if exists music163','drop table if exists comment163'];
	let playlist = 'CREATE TABLE `playlist163` (`id` int(11) NOT NULL AUTO_INCREMENT,`title` varchar(150) DEFAULT \'\',`link` varchar(120) DEFAULT \'\',`create_time` datetime DEFAULT CURRENT_TIMESTAMP,`over` varchar(20) DEFAULT \'N\',PRIMARY KEY (`id`),KEY `over_link` (`over`,`link`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4';
	let music    = 'CREATE TABLE `music163` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(200) DEFAULT \'\',`song_id` int(11) DEFAULT NULL, `author` varchar(350) DEFAULT \'\',`over` varchar(5) DEFAULT \'N\',`create_time` datetime DEFAULT CURRENT_TIMESTAMP,`comment_id` int(11) DEFAULT \'0\',PRIMARY KEY (`id`),KEY `over_id` (`over`,`id`),KEY `author` (`author`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4';
	let comment  = 'CREATE TABLE `comment163` (`id` int(11) NOT NULL AUTO_INCREMENT,`music_id` int(11) DEFAULT NULL,`txt` mediumtext,`author` varchar(100) DEFAULT \'注销\',PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=1418975 DEFAULT CHARSET=utf8mb4';

	dropdbs.forEach(function(sql) {
		query(sql);
	});

	query(playlist);
	query(music);
	query(comment);
	console.log('TABLES RECREATE SUCCESS');
}

function close() {
	connection.destroy();
}

module.init = init;
module.query = query;
module.close = close;
