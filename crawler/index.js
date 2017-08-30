'use strict';
let playlistDao = require('./dao/playlist-dao');
let musicListDao = require('./dao/music-dao');
const MAX_PAGE = 40;

let discoverPage = require('./pages/discover');
let playlistPage = require('./pages/playlist');
let musicPage = require('./pages/music');

// for (let i = 0 ; i < MAX_PAGE; i++) {
//     discoverPage.viewCapture(i);
// }


// playlistDao.getAll().then(function (allPlaylist) {
//     for (let i = 0; i < allPlaylist.length; i++){
//         let link = allPlaylist[i].link;
//         console.log('playlist link:', link);
//         playlistPage.viewCapture(link);
//     }
// }).catch(function (err) {
//     console.log('playlistDao getAll 失败，错误信息：', err.message);
// });

musicListDao.getAll().then(function (allMusiclist) {
    for (let i = 0; i < 10; i++){
        let musicId = allMusiclist[i].song_id;
        console.log('musicId:' + musicId);
        musicPage.viewCapture(musicId);
    }

});
