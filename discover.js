'use strict';

/**
 * 抓取歌单列表
 * get playlist from http://music.163.com/discover/playlist/?order=hot&cat=全部&limit=35&offset=
 */

const MusicSuperAgent = require('./music-super-agent');
const cheerio = require('cheerio');
const sprintf = require('sprintf-js').sprintf;

let playUrl = 'http://music.163.com/discover/playlist/';

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
				if(!havePlaylist()) {
					insertPlaylist();
				}
			});
		});

}

function havePlaylist() {

}

function insertPlaylist() {

}

exports.viewCapture = viewCapture;

