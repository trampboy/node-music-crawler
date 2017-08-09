'use strict';
let db = require('./database/database');
const MAX_PAGE = 40;

let discover  = require('./pages/discover');
for (let i = 0 ; i < MAX_PAGE; i++) {
    discover.viewCapture(i);
}

let sql = 'SELECT p.link from playlist163 as p';
db.query(sql);
