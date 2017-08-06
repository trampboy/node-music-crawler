'use strict';

/**
 * 抓取歌单列表
 * get playlist from http://music.163.com/discover/playlist/?order=hot&cat=全部&limit=35&offset=
 */

let MusicSuperAgent = require('./music-super-agent');
let cheerio = require('cheerio');
let sprintf = require('sprintf-js').sprintf;
let db = require('./db');

let playUrl = 'http://music.163.com/discover/playlist';

function viewCapture(page) {
	let pageOffset = page * 35;
	console.log('url:' + playUrl);
	let musicSuperAgent = new MusicSuperAgent();
    musicSuperAgent
		.get(playUrl)
		.query({ order: 'hot', cat: '全部', limit: '35', offset: pageOffset})
		.end(function(err, sres){
			if(err) {
				console.log('viewCapture err:' + err);
				return;
			}
			// sres.text have the html data
			// console.log(sres.text);
			let $ = cheerio.load(sres.text);
			$('ul.m-cvrlst.f-cb li p.dec a').each(function(i,v) {
				let title = $(v).attr('title');
				let link = $(v).attr('href');

				console.log(sprintf('title:%1$s, link:%2$s', title, link));
				if(!havePlaylist(title)) {
					insertPlaylist(title, link);
				}
			});
		});

}

function havePlaylist(title) {
	let sql = 'SELECT COUNT(title) FROM playlist163 WHERE title="' + title + '"';
    db.query(sql);
    db.close();
}

function insertPlaylist(title, link) {
	let sql = 'INSERT INTO playlist163 (title, link) VALUE ("' + title + '", "' + link + '")';
	db.query(sql);
	db.close();
}

exports.viewCapture = viewCapture;

// For Test
// viewCapture(0)

