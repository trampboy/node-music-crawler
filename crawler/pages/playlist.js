/**
 * 抓取歌单
 * http://music.163.com/#/playlist?id=826797842
 * Created by BuEr on 28/07/2017.
 */

const MusicSuperAgent = require('./../utils/music-super-agent');
const cheerio = require('cheerio');
const sprintf = require('sprintf-js').sprintf;

let playUrl = 'http://music.163.com/playlist';

function viewCapture(id) {
    let musicSuperAgent = new MusicSuperAgent();
    console.log('id:', id);
    musicSuperAgent
        .get(playUrl)
        .query({id:id})
        .end(function (err, sres) {
            if (err) {
                console.log('viewCapture err:', err);
                return;
            }
            console.log('sres.text:', sres.text);
            let $ = cheerio.load(sres.text);
            let textarea = JSON.parse($('div#song-list-pre-cache textarea').text());
            console.log('textarea', textarea);
            for(let index in textarea) {
                let value = textarea[index];
                console.log(sprintf('index:%1$s,value:%2$s', index, value));
                let name = value['name'];
                let author = value['artists'][0]['name'];
                let songId= value['id'];
                console.log(sprintf('name:%1$s, songId:%2$s, href:%3$s', name, songId, author));
            }
        });
}

exports.viewCapture = viewCapture;

// For Test
viewCapture(822818142);
