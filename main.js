// pm2 start main.js --watch : 변경되면 노드 재시작
// pm2 list : 감시 중인 파일 목록
// pm2 kill : pm2 관련 프로세스 전부 종료
// pm2 log : 파일 변경될 때 로그에 남김
// pm2 start main.js --watch --no-daemon : pm2 log 를 합친 기능 (--no-daemon)
// pm2 start main.js --watch --ignore-watch="data/*" --no-daemon : 파일을 수정하거나 삭제해도 노드가 재시작 되지 않음 (data 폴더 아래 모든 파일)
// pm2 start main.js --watch --ignore-watch="data/* session/*" --no-daemon : 여러 폴더는 띄어쓰기 구분해서 사용할 수 있다.
console.log('Hello no-deamon');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

const template = require('./lib/template');



var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log('pathname: ', url.parse(request.url).pathname);
    if (url.parse(request.url, true).pathname === '/') {
        if (url.parse(request.url, true).query.id === undefined) {
            fs.readdir('./data', (err, fileList) => {
                var title = 'Welcome';
                var data = 'Hello, Node.js';
                var list = template.list(fileList);
                var html = template.html(title, list,
                    `<h2>${title}</h2><p>${data}</p>`,
                    `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            var filteredPath = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredPath}`, 'utf8', (err, data) => {
                fs.readdir('./data', (err, fileList) => {
                    var title = queryData.id;
                    var sanitizeTitle = sanitizeHtml(title);
                    var sanitizeData = sanitizeHtml(data, {
                        allowedTags: ['h1'],
                    });
                    var list = template.list(fileList);
                    var html = template.html(sanitizeTitle, list,
                        `<h2>${sanitizeTitle}</h2>${sanitizeData}`,
                        `<a href="/create">create</a> 
                                <a href="/update?id=${sanitizeTitle}">update</a>
                                <form action="/delete_process" method="post">
                                    <input type="hidden" name="id" value="${sanitizeTitle}">
                                    <input type="submit" value="delete">
                                </form>`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (url.parse(request.url).pathname === '/create') {
        fs.readdir('./data', (err, fileList) => {
            var title = 'WEB - create';
            var list = template.list(fileList);
            var html = template.html(title, list,
                `<form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`,
                ''
            );
            response.writeHead(200);
            response.end(html);
        });
    } else if (url.parse(request.url).pathname === '/create_process') {
        var body = '';
        request.on('data', (data) => {
            console.log(`data: ${data}`);
            body = body + data;
        });
        request.on('end', () => {
            var post = qs.parse(body);
            console.log(`post: ${JSON.stringify(post)}`);
            const title = post.title;
            const description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                response.writeHead(301, {Location: `/?id=${title}`});
                response.end();
            });
        });

    } else if (url.parse(request.url).pathname === '/update') {
        var filteredPath = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredPath}`, 'utf8', (err, data) => {
            fs.readdir('./data', (err, fileList) => {
                var title = queryData.id;
                var list = template.list(fileList);
                var html = template.html(title, list,
                    `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${data}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (url.parse(request.url).pathname === '/update_process') {
        var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            console.log(post);
            fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
                fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                    response.writeHead(301, {Location: `/?id=${title}`});
                    response.end();
                });
            });

        });

    } else if (url.parse(request.url).pathname === '/delete_process') {
        var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            const id = post.id;
            const filteredPath = path.parse(id).base;
            console.log(post);
            fs.unlink(`data/${filteredPath}`, (err) => {
                response.writeHead(301, {Location: `/`});
                response.end();
            });
        });

    } else {
        response.writeHead(404);
        response.end('not found');

    }
});

app.listen(3000);


const app2 = http.createServer((req, res) => {

    res.writeHead(200);
    res.end('This server port is 3050');
});

app2.listen(3050);
