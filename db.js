var mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
})

function init() {
	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack)
			return false
		}
		return true
	}

}


function createDatabase() {
	let database = 'CREATE DATABASE music_crawler'
	query(database)
	console.log('create database success')

}
function query(sql) {
	connection.query(sql, function(error, results, fields){
		if (error) throw error
		console.log('fields:' + fields)

		return results
	})

}

function createTables() {
	dropdbs  = ["drop table if exists playlist163","drop table if exists music163","drop table if exists comment163"]
    playlist = "CREATE TABLE `playlist163` (`id` int(11) NOT NULL AUTO_INCREMENT,`title` varchar(150) DEFAULT '',`link` varchar(120) DEFAULT '',`cnt` varchar(20) DEFAULT '0',`dsc` varchar(50) DEFAULT 'all',`create_time` datetime DEFAULT CURRENT_TIMESTAMP,`over` varchar(20) DEFAULT 'N',PRIMARY KEY (`id`),KEY `over_link` (`over`,`link`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4"
    music    = "CREATE TABLE `music163` (`id` int(11) NOT NULL AUTO_INCREMENT,`song_id` int(11) DEFAULT NULL,`song_name` varchar(200) DEFAULT '',`author` varchar(350) DEFAULT '',`over` varchar(5) DEFAULT 'N',`create_time` datetime DEFAULT CURRENT_TIMESTAMP,`comment` int(11) DEFAULT '0',PRIMARY KEY (`id`),KEY `over_id` (`over`,`id`),KEY `author` (`author`),KEY `song_id_comment` (`song_id`,`comment`)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4"
    comment  = "CREATE TABLE `comment163` (`id` int(11) NOT NULL AUTO_INCREMENT,`song_id` int(11) DEFAULT NULL,`txt` mediumtext,`author` varchar(100) DEFAULT '注销', `liked` int(11) DEFAULT '0',PRIMARY KEY (`id`), KEY `liked_song_id` (`liked`,`song_id`), KEY `song_id_liked` (`song_id`,`liked`)) ENGINE=InnoDB AUTO_INCREMENT=1418975 DEFAULT CHARSET=utf8mb4"  

	dropdbs.forEach(function(sql) {
		query(sql)
	})

	query(playlist)
	query(music)
	query(comment)
    print("TABLES RECREATE SUCCESS")
}

function close() {
	connection.destroy()
}
