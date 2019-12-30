var fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression')
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');

const helmet = require('helmet');


const app = express();

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());


// app.use()를 사용하면 모든 라우터의 요청에 대해 readdir이 실행되는데
// app.get()은 get요청에 대한 라우터에서만 실행되고, 첫번째 인자의 '*'는 모든 요청에 대해서만 콜백함수를 실행한다.
// Express에서는 app.use()만 미들웨어라고 생각되었지만 app.get()도 미들웨어이다. 즉, 모든 라우터가 미들웨어이다.
app.get('*', (request, response, next) => {

    fs.readdir('./data', (err, fileList) => {
        request.list = fileList;
        next();
    });
});


app.use('/', indexRouter);
app.use('/topic', topicRouter);


app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});


// if(err) next(err); 다음에 오는 미들웨어
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});



app.listen(3000, () => {
    console.log('listening on port 3000!');
});


/*
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
    if (url.parse(request.url, true).pathname === '/') {
        if (url.parse(request.url, true).query.id === undefined) {
            
        } else {
            
        }
    } else if (url.parse(request.url).pathname === '/create') {
        
    } else if (url.parse(request.url).pathname === '/create_process') {

    } else if (url.parse(request.url).pathname === '/update') {
        
    } else if (url.parse(request.url).pathname === '/update_process') {
        

    } else if (url.parse(request.url).pathname === '/delete_process') {
        

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
*/