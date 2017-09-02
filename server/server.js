/**
 * Created by YanMingDao on 02/09/2017.
 */

let http = require('http');
let url = require('url');
let routes = {'all': []};
let app = {};

// /comments{?page=1&per_page=100} => {params: {page:1, per_page=100},regexp: new RegExp('^comments$')}
let pathRegexp = function (allPath) {
    let allPathSplit = allPath.split('?');
    let path = allPathSplit[0];
    let params = {};
    allPathSplit[1].forEach(function (result) {
        let resultSplit = result.split('=');
        let key = resultSplit[0];
        let value = resultSplit[1];
        if (key && value) {
            params[key] = value;
        }
    });
    return {
        params: params,
        regexp: new RegExp('^' + path + '$')
    };
};

app.use = function (path, action) {
    routes.all.push([pathRegexp(path), action]);
};

// 增加用户
// app.post('/user/:username', addUser);

// 删除用户
// app.delete('/user/:username', deleteUser);

// 需改用户
// app.put('/user/:username', updateUser);

// 查询用户
// app.get('/user/:username', getUser);

['get', 'put', 'delete', 'post'].forEach(function (method) {
    routes[method] = [];
    app[method] = function (path, action) {
        routes[method].push([pathRegexp(path), action]);
    };
});

let match = function (pathname, routes) {
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i];
        let reg = route[0].regexp;
        let params = route[0].params;
        let matched = reg.exec(pathname);
        if (matched) {
            this.req.params = params;
            let action = route[1];
            action(this.req, this.res);
            return true;
        }
    }

    return false;
};

let handle404 = function (req, res) {
    res.writeHead(404);
    res.end('请求不存在');
};

http.createServer(function (req, res) {
    let pathname = url.parse(req.url).pathname;
    let method = req.method.toLowerCase();
    if (routes.hasOwnProperty(method)) {
        //根据请求方法分发
        if (match(pathname, routes[method])) {
            return;
        } else {
            //如果路径没有匹配成功，尝试让all()处理
            if (match(pathname, routes.all)) {
                return;
            }
        }
    } else {
        if (match(pathname, routes.all)) {
            return;
        }
    }

    handle404(req, res);
}).listen(8080, '127.0.0.1');

// /comments{?page=1&per_page=100}
// app.get('/comments', function (req, res) {
//
// });

console.log('Server running at http://127.0.0.1:8080');