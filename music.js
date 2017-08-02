'use strict';

/**
 * get music from http://music.163.com/song?id=109172
 */

let MusicSuperAgent = require('./music-super-agent');
let cheerio = require('cheerio');
let crypto = require('crypto');
let sprintf = require('sprintf-js').sprintf;
let bigInt = require('big-integer');

let MAX_PAGES = 1024;
let modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
let pubKey  = '010001';
let secKey = random(16);

function viewCapture(id, page = 1, pages = MAX_PAGES) {


    if (page > 1) {
        while (page < pages) {
            pages = viewComment(id, page);
            page++;
        }

    } else {
        viewComment(id, page);
    }

    viewSongUrl(id);
}

function viewSongUrl(id) {
    let url = 'http://music.163.com/song?id=' + id;
    new MusicSuperAgent()
        .get(url)
        .query({id: id})
        .end(function (err, data) {
            if (err) {
                console.log('err:', err);
                return ;
            }
            console.log('viewSongUrl', data.text);
            // let $ = cheerio.load(data.text);
            // console.log();
            // let commment = '';
            // let musicId = id;
            // let author = '';

        });
}

function viewComment(id, page) {
    let url  = 'http://music.163.com/weapi/v1/resource/comments/R_SO_4_' + id + '/?csrf_token=';
    let encSecKey = rsaEncrypt(secKey, pubKey, modulus);
    let musicSuperAgent = new MusicSuperAgent();
    musicSuperAgent
        .post(url)
        .send({params: createParams(page), encSecKey: encSecKey})
        .end(function (err, data) {
            if (err) {
                console.log('err:', err);
                return ;
            }
            console.log('viewComment', data.text);
            // let $ = cheerio.load(data.text);
            // console.log();
            // let commment = '';
            // let musicId = id;
            // let author = '';

        });

}

function createParams(page) {
    let text = '';
    let offset = '';
    if (page == 1) {
        text = '{rid:"", offset:"0", total:"true", limit:"20", csrf_token:""}';
    } else {
        offset = (page-1)*20;
        text = sprintf('{rid:"", offset:"%1%s", total:"false", limit:"20", csrf_token:""}', offset);
    }
    console.log('createParams text:', text);
    let nonce   = '0CoJUm6Qyw8W8jud';
    return aesEncrypt(aesEncrypt(text, nonce), secKey);
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
    let iHex = parseInt(hex, 16);
    let iPubKey = parseInt(pubKey, 16);
    let iSecKey = parseInt(secKey, 16);
    let rs = bigInt(iHex).pow(iPubKey).mod(iSecKey);
    let result = rs.toString(16);
    if (result.length >= 256) {
        return result.split(result.length - 256, result.length);
    } else {
        while (result.length < 256) {
            result = '0' + result;
        }
        return result;
    }
}


// for test
// viewSongUrl(109172);

// let aesdata = aesEncrypt('{rid:"", offset:"0", total:"true", limit:"20", csrf_token:""}', '0CoJUm6Qyw8W8jud');
// console.log('aesdata:', aesdata);

modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
// modulus = '12344556'
pubKey = '010001';
// pubKey = '1'
secKey = 'FFFFFFFFFFFFFFFF';
let encData = rsaEncrypt(secKey, pubKey, modulus);
console.log('encData:', encData);


// text: FFFFFFFFFFFFFFFF
// text: FFFFFFFFFFFFFFFF
// hexText: 46464646464646464646464646464646
// iHex: 93410845821434088009553813804799116870
// iPubKey: 65537
// iModulus: 157794750267131502212476817800345498121872783333389747424011531025366277535262539913701806290766479189477533597854989606803194253978660329941980786072432806427833685472618792592200595694346872951301770580765135349259590167490536138082469680638514416594216629258349130257685001248172188325316586707301643237607
// rs: 26298514526120378617989563764200539980551128747038233341720922032422896004266777960750174725831502526157526636642731902802717191902401962471665777622958783348112857074113769747916124480482660524940161521943187517804392780022521505974483019404927056698963502894502425861465162968394012861423740369743551751036
// data: 257348aecb5e556c066de214e531faadd1c55d814f9be95fd06d6bff9f4c7a41f831f6394d5a3fd2e3881736d94a02ca919d952872e7d0a50ebfa1769a7a62d512f5f1ca21aec60bc3819a9c3ffca5eca9a0dba6d6f7249b06f5965ecfff3695b54e1c28f3f624750ed39e7de08fc8493242e26dbc4484a01c76f739e135637c


