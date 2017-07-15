'use strict';

/**
 *
 * get playlist from http://music.163.com/discover/playlist/?order=hot&cat=全部&limit=35&offset=
 */

var superagent = require("superagent")
var cheerio = require("cheerio")


//header = {
//	'Referer': 'http://music.163.com/',
//	'Host': 'music.163.com',
//	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
//	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
//}

let playUrl = 'http://music.163.com/discover/playlist/?order=hot&cat=全部&limit=35&offset='

function viewCapture(page) {
	let url = playUrl + page * 35
	console.log('url:' + url)
	superagent
		.get(url)
		.set('referer', 'http://music.163.com/')
		.set('Host', 'music.163.com')
		.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36')
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.end(function(err, sres){
			if(err) {
				console.log('viewCapture err:' + err)
				return;
			}
			// sres.text have the html data
			console.log(sres.text)
			var $ = cheerio.load(sres.text)
			
			;
		})

}

exports.viewCapture = viewCapture
