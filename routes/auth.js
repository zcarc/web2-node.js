var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');

const express = require('express');
const router = express.Router();

var authData = {
    email: '123@123.123',
    password: '123',
    nickname: 'authTest',
}

router.get('/login', (request, response) => {

    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<form action="/auth/login_process" method="post">
            <p>
                <input type="text" name="email" placeholder="email">
            </p>
            <p>
                <input type="password" name="pwd" placeholder="password">
            </p>
            <p>
                <input type="submit" value="login">
            </p>
        </form>`,
        ''
    );

    response.send(html);
});

router.post('/login_process', (request, response) => {

    const post = request.body
    const email = post.email;
    const password = post.pwd;
    if(email === authData.email && password && authData.password) {
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;

        // 세션 객체에 있는 데이터를 세션 스토어에 반영하는 작업을 바로 시작한다.
        // 이 작업이 없으면 세션 스토어에 반영하기도 전에 redirect()가 호출될 수도 있다.
        request.session.save(() => {
            response.redirect(`/`); 
        });
        
    } else {
        response.send('Who?');
    }
    
});


router.get('/logout', (request, response) => {
    request.session.destroy((err) => {
        response.redirect('/');
    });
    
});

module.exports = router;