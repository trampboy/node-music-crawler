'use strict';
let playlistDao = require('./dao/playlist-dao');
const MAX_PAGE = 40;

let discover = require('./pages/discover');
let playlistPage = require('./pages/playlist');

// for (let i = 0 ; i < MAX_PAGE; i++) {
//     discover.viewCapture(i);
// }


playlistDao.getAll().then(function (allPlaylist) {
    for (let i = 0; i < allPlaylist.length; i++){
        let link = allPlaylist[i].link;
        console.log('playlist link:', link);
        playlistPage.viewCapture(link);
    }
}).catch(function (err) {
    console.log('playlistDao getAll 失败，错误信息：', err.message);
});

