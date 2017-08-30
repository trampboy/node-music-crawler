'use strict';

/**
 * get music from http://music.163.com/song?id=109172
 */

let MusicSuperAgent = require('./../utils/music-super-agent');
let cheerio = require('cheerio');
let crypto = require('crypto');
let sprintf = require('sprintf-js').sprintf;
let BigNumber = require('bignum');
let commentDao = require('../dao/comment-dao');

let modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
let pubKey  = '010001';
let secKey = random(16);


function viewCapture(id, page = 1) {
    viewComment(id, page);
    // viewSongUrl(id);
}

function viewSongUrl(id) {
    let url = 'http://music.163.com/song';
    new MusicSuperAgent()
        .get(url)
        .query({id: id})
        .end(function (err, data) {
            if (err) {
                console.log('err:', err);
                return ;
            }
            let $ = cheerio.load(data.text);
            let title = $('em.f-ff2').text();
            let musicId = id;
            let author = $('span')[1].attribs.title;
            console.log(sprintf('title:%1$s, musicId:%2$s, author:%3$s', title, musicId, author));


        });
}

function viewComment(id, page) {
    let url  = 'http://music.163.com/weapi/v1/resource/comments/R_SO_4_' + id + '/?csrf_token=';
    let getEncSecKey = rsaEncrypt(secKey, pubKey, modulus);
    let getParams = createParams(page);
    let musicSuperAgent = new MusicSuperAgent();
    musicSuperAgent
        .post(url)
        .send({params: getParams, encSecKey: getEncSecKey})
        .end(function(err, data) {
            if (err) {
                console.log('err:', err);
                return ;
            }

            let hotComments = JSON.parse(data.text).hotComments;
            // console.log('hotComments', hotComments);
            for (let index in hotComments) {
                let userComment = hotComments[index];
                let comment = userComment.content;
                let author = userComment.user.nickname;
                let musicId = id;
                // console.log(sprintf('author:%1$s, comment:%2$s, musicId:%3$s', author, comment, musicId));
                commentDao.hasComment(comment)
                    .then(function (result) {
                        if (!result) {
                            console.log(sprintf('add new author:%1$s, comment:%2$s, musicId:%3$s', author, comment, musicId));
                            commentDao.insert({comment: comment, musicId: musicId, author:author});
                        }
                    });
            }
        });

}

function createParams(page) {
    let text = '';
    let offset = '';
    if (page == 1) {
        text = '{rid:"", offset:"0", total:"true", limit:"20", csrf_token:""}';
    } else {
        offset = (page-1)*20;
        text = sprintf('{rid:"", offset:"%1$s", total:"false", limit:"20", csrf_token:""}', offset);
    }
    let nonce   = '0CoJUm6Qyw8W8jud';
    let result = aesEncrypt(text, nonce);
    result = aesEncrypt(result, secKey);
    return result;
}

function aesEncrypt(text, secKey) {
    let iv = '0102030405060708';
    let clearEncoding = 'utf8';
    let cipherEncoding = 'base64';
    let cipherChunks = [];
    let cipher = crypto.createCipheriv('aes-128-cbc', secKey, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(text, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

function random(len){
    let str = '',
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for(let i = 0; i < len; i++){
        let pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}


function rsaEncrypt(text, pubKey, secKey) {
    let data = text.split('').reverse().join('');
    let hex = new Buffer(data).toString('hex');
    let iHex = new BigNumber(hex, 16);
    let iPubKey = new BigNumber(pubKey, 16);
    let iSecKey = new BigNumber(secKey, 16);
    let rs = iHex.pow(iPubKey).mod(iSecKey);
    let result = rs.toString(16);
    if (result.length >= 256) {
        return result.substr(result.length - 256, result.length);
    } else {
        while (result.length < 256) {
            result = '0' + result;
        }
        return result;
    }
}

exports.viewCapture = viewCapture;
// for test
// viewCapture(350840);