'use strict';

/**
 *
 * get playlist from http://music.163.com/discover/playlist/?order=hot&cat=全部&limit=35&offset=
 */

var superagent = require('superagent');
var cheerio = require('cheerio');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	database : 'my_db'
});

let playUrl = 'http://music.163.com/discover/playlist/';

function viewCapture(page) {

	let pageOffset = page * 35;
	console.log('url:' + playUrl);
	superagent
		.get(playUrl)
		.set('Referer', 'http://music.163.com/')
		.set('Host', 'music.163.com')
		.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36')
		.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
		.set('Accept-Encoding', 'gzip, deflate')
		.set('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6')
		.set('Cache-Control', 'no-cache')
		.set('Connection', 'keep-alive')
		.set('Cookie', 'mail_psc_fingerprint=34804d1cbddf2f66f7354d37ba73c3a3; _ntes_nnid=e58241ca51087e0b92720f35d14ca64d,1487991584213; _ntes_nuid=e58241ca51087e0b92720f35d14ca64d; usertrack=c+5+hVjKUo8CBjUbAym4Ag==; P_INFO=jhg19900321@163.com|1497154428|0|mail163|11&15|zhj&1497154379&mail163#zhj&330100#10#0#0|136661&0|mail163|jhg19900321@163.com; Qs_lvt_73318=1497963077%2C1498104757; Qs_pv_73318=4526914453649381000%2C1182783655750914300; Province=0571; City=0571; __utma=187553192.1165564095.1489654420.1494660015.1499299560.2; __utmz=187553192.1499299560.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _ga=GA1.2.1165564095.1489654420; JSESSIONID-WYYY=T1fMybTqRWqNO9aTznvl2tnW%2F6ki4Udj2NuUwxJeEEBNR%2FYbMxG4c%5CDplJ%2FzBBT%5C%5CSQsdcCqWcIdgYTVdOPY0gF2otlnIcOoU0OJ0D6lDjYOGJHo4pei1nyEIcwDfVev%5CrgixQs%5CJdlp5ImcwtSn3wyhbEknWw2vguI%2FgZMWVIt%2FeaNY%3A1500137389035; _iuqxldmzr_=32; __utma=94650624.1165564095.1489654420.1500131467.1500134482.13; __utmb=94650624.4.10.1500134482; __utmc=94650624; __utmz=94650624.1500104489.9.3.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)')
		.set('Upgrade-Insecure-Requests', '1')
		.query({ order: 'hot', cat: '全部', limit: '35', offset: pageOffset})
		.end(function(err, sres){
			if(err) {
				console.log('viewCapture err:' + err);
				return;
			}
			// sres.text have the html data
			console.log(sres.text);
			var $ = cheerio.load(sres.text);
			$('ul.m-cvrlst.f-cb li p.dec a').each(function(i,v) {
				var title = $(v).attr('title');
				var href = $(v).attr('href');
				console.log('title:'+title);
				console.log('href:'+href);
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

