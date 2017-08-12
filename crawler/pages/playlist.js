/**
 * 抓取歌单
 * http://music.163.com/#/playlist?id=826797842
 * Created by BuEr on 28/07/2017.
 */

let MusicSuperAgent = require('./../utils/music-super-agent');
let cheerio = require('cheerio');
let sprintf = require('sprintf-js').sprintf;
let musicDao = require('../dao/music-dao');

let playUrl = 'http://music.163.com';

function viewCapture(link) {
    let musicSuperAgent = new MusicSuperAgent();
    musicSuperAgent
        .get(playUrl + link)
        .end(function (err, sres) {
            if (err) {
                console.log('viewCapture err:', err);
                return;
            }
            // console.log('sres.text:', sres.text);
            let $ = cheerio.load(sres.text);
            let textarea = JSON.parse($('div#song-list-pre-cache textarea').text());
            // console.log('textarea', textarea);
            for(let index in textarea) {
                let value = textarea[index];
                console.log(sprintf('index:%1$s,value:%2$s', index, value));
                let name = value['name'];
                let author = value['artists'][0]['name'];
                let songId= value['id'];
                console.log(sprintf('name:%1$s, songId:%2$s, author:%3$s', name, songId, author));
                musicDao.hasContain(name)
                    .then(function (result) {
                        if (!result) {
                            musicDao.insert({name:name, songId:songId, author:author}).catch(function (err) {
                                console.log('err:', err);
                            });
                        }
                    });
            }
        });
}

exports.viewCapture = viewCapture;

// For Test
// viewCapture('/playlist?id=822818142');
