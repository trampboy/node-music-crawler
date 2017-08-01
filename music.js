'use strict';

/**
 * get music from http://music.163.com/song?id=109172
 */

let MusicSuperAgent = require('./music-super-agent');
let cheerio = require('cheerio');
let crypto = require('crypto');
const sprintf = require('sprintf-js').sprintf;

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
        .send({params: createParams(page), encSecKey: encSecKey()})
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
    let data = text.reverse();
    let hex = new Buffer(data).toString('hex');
    let rs = Math.pow(hex.parseInt(16), pubKey.parseInt(16)) % secKey.parseInt(16);
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

// private final static String modulus = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7" +
//     "b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280" +
//     "104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932" +
//     "575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b" +
//     "3ece0462db0a22b8e7";
//
// private final static String nonce = "0CoJUm6Qyw8W8jud";
// private final static String pubKey = "010001";
//
// private static final String PARAMS = "params";
// private static final String ENCSECKEY = "encSecKey";
//
// public static Map<String, String> encrypt(String text) {
//     String secKey = RandomStringUtils.random(16, "0123456789abcde");
//     String encText = aesEncrypt(aesEncrypt(text, nonce), secKey);
//     String encSecKey = rsaEncrypt(secKey, pubKey, modulus);
//
//     Map<String, String> map = new HashMap<String, String>();
//     map.put(PARAMS, encText);
//     map.put(ENCSECKEY, encSecKey);
//     return map;
// }
//
// private static String aesEncrypt(String text, String key) {
//     try {
//         IvParameterSpec iv = new IvParameterSpec("0102030405060708".getBytes("UTF-8"));
//         SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");
//
//         Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
//         cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
//
//         byte[] encrypted = cipher.doFinal(text.getBytes());
//
//         return new BASE64Encoder().encode(encrypted);
//     } catch (Exception e) {
//         return "";
//     }
// }
//
// private static String rsaEncrypt(String text, String pubKey, String modulus) {
//     text = new StringBuilder(text).reverse().toString();
//     BigInteger rs = new BigInteger(String.format("%x", new BigInteger(1, text.getBytes())), 16)
//         .modPow(new BigInteger(pubKey, 16), new BigInteger(modulus, 16));
//     String r = rs.toString(16);
//     if (r.length() >= 256) {
//         return r.substring(r.length() - 256, r.length());
//     } else {
//         while (r.length() < 256) {
//             r = 0 + r;
//         }
//         return r;
//     }
// }


// for test
// viewSongUrl(109172);

// let aesdata = aesEncrypt('{rid:"", offset:"0", total:"true", limit:"20", csrf_token:""}', '0CoJUm6Qyw8W8jud');
// console.log('aesdata:', aesdata)
//
// let encData = rsaEncrypt()


