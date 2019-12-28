// pm2 start main.js --watch : 변경되면 노드 재시작
// pm2 list : 감시 중인 파일 목록
// pm2 kill : pm2 관련 프로세스 전부 종료
// pm2 log : 파일 변경될 때 로그에 남김
// pm2 start main.js --watch --no-daemon : pm2 log 를 합친 기능 (--no-daemon)
// pm2 start main.js --watch --ignore-watch="data/*" --no-daemon : 파일을 수정하거나 삭제해도 노드가 재시작 되지 않음 (data 폴더 아래 모든 파일)
// pm2 start main.js --watch --ignore-watch="data/* session/*" --no-daemon : 여러 폴더는 띄어쓰기 구분해서 사용할 수 있다.

const http = require('http');
const url = require('url');
const mysql = require('mysql');
const db = require('./lib/db');
const topic = require('./lib/topic');
const template = require('./lib/template');
const author = require('./lib/author');

// querystring 쓰는 이유: get 방식에서 쿼리 스트링을 객체 형식으로 파싱해준다. (ex: 링크 접속으로 받아온 쿼리스트링을 파싱)
// url 쓰는 이유 : url에 요청된 데이터들을 기반으로 pathname, query 등을 객체로 파싱해준다.


var app = http.createServer(function (request, response) {

    if (url.parse(request.url, true).pathname === '/') {

        if (url.parse(request.url, true).query.id === undefined) {
            topic.home(request, response);

        } else {
            topic.page(request, response);
        }

    } else if (url.parse(request.url).pathname === '/create') {
        topic.create(request, response);

    } else if (url.parse(request.url).pathname === '/create_process') {
        topic.create_process(request, response);

    } else if (url.parse(request.url).pathname === '/update') {
        topic.update(request, response);

    } else if (url.parse(request.url).pathname === '/update_process') {
        topic.update_process(request, response);

    } else if (url.parse(request.url).pathname === '/delete_process') {
        topic.delete_process(request, response);

    } else if (url.parse(request.url).pathname === '/author') {
        author.home(request, response);

    } else if (url.parse(request.url).pathname === '/author/create_process') {
        author.create_process(request, response);

    } else if (url.parse(request.url).pathname === '/author/update') {
        author.update(request, response);

    } else if (url.parse(request.url).pathname === '/author/update_process') {
        author.update_process(request, response);

    } else if (url.parse(request.url).pathname === '/author/delete_process') {
        author.delete_process(request, response);

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
