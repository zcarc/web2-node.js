var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');
const auth = require('../lib/auth');

const express = require('express');
const router = express.Router();


router.get('/create', (request, response) => {

    if(!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }

    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>`,
        '',
        auth.statusUI(request, response)
    );

    response.send(html);
});


router.post('/create_process', (request, response) => {

    if(!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }

    const post = request.body
    const title = post.title;
    const description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {

        response.redirect(`/topic/${title}`);
    });
});


router.get('/update/:pageId', (request, response) => {

    if(!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }

    var filteredPath = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredPath}`, 'utf8', (err, data) => {
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.html(title, list,
            `<form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${data}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>`,
            `<a href="/topic/create">create</a>`,
            auth.statusUI(request, response)
        );
        response.send(html);
    });
});


router.post('/update_process', (request, response) => {

    if(!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }

    const post = request.body;
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {

            response.redirect(`/topic/${title}`);
        });
    });
   
});


router.post('/delete_process', (request, response) => {

    if(!auth.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }

    const post = request.body;
    const id = post.id;
    const filteredPath = path.parse(id).base;
    console.log(post);
    fs.unlink(`data/${filteredPath}`, (err) => {

        response.redirect('/');
    });
});


router.get('/:pageId', (request, response, next) => {

    var filteredPath = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredPath}`, 'utf8', (err, data) => {

        if(err){
            next(err);

        } else {
            var title = request.params.pageId;
            var sanitizeTitle = sanitizeHtml(title);
            var sanitizeData = sanitizeHtml(data, {
                allowedTags: ['h1'],
            });
            var list = template.list(request.list);
            var html = template.html(sanitizeTitle, list,
                `<h2>${sanitizeTitle}</h2>${sanitizeData}`,
                `<a href="/topic/create">create</a> 
                <a href="/topic/update/${sanitizeTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizeTitle}">
                    <input type="submit" value="delete">
                </form>`,
                auth.statusUI(request, response));
    
            response.send(html);
        }
    });
});

module.exports = router;