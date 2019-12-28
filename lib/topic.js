const url = require('url');
const qs = require('querystring');
const db = require('./db');
const template = require('./template');
const sanitizeHTML = require('sanitize-html');

exports.home = (request, response) => {

    db.query(`select * from topic`, (err, topics) => {
        var title = 'Welcome';
        var data = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.html(title, list,
            `<h2>${title}</h2><p>${data}</p>`,
            `<a href="/create">create</a>`);
        response.writeHead(200);
        response.end(html);
    });
}


exports.page = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;

    db.query(`select * from topic`, (err, topics) => {
        if(err) throw err;

        const query = db.query('select * from topic left join author on topic.author_id = author.id where topic.id = ?', queryData.id, (err2, topic) => {
            if(err2) throw err2;
            var title = topic[0].title;
            var data = topic[0].description;
            var list = template.list(topics);
            var html = template.html(title, list,
                `<h2>${sanitizeHTML(title)}</h2>
                <p>${sanitizeHTML(data)}</p>
                <p>by ${sanitizeHTML(topic[0].name)}</p>`,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                         <form action="/delete_process" method="post">
                             <input type="hidden" name="id" value="${queryData.id}">
                             <input type="submit" value="delete">
                         </form>`);

            console.log('query: ', query.sql);
            response.writeHead(200);
            response.end(html);
        });
        
    });
}


exports.create = (request, response) => {

    db.query(`select * from topic`, (err, topics) => {

        db.query(`select * from author`, (err, authors) => {
            const title = 'WEB - create';
            const list = template.list(topics);
            const html = template.html(sanitizeHTML(title), list,
                `<form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <select name="author">
                            ${template.authorSelect(authors)}
                        </select>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`,
                '');
            response.writeHead(200);
            response.end(html);
        });
        
    });
    
}


exports.create_process = (request, response) => {

    var body = '';
        request.on('data', (data) => {
            console.log(`data: ${data}`);
            body = body + data;
        });
        request.on('end', () => {
            var post = qs.parse(body);

            db.query(`insert into topic (title, description, created, author_id) values(?, ?, now(), ?)`,
                [post.title, post.description, post.author],
                (err, result) => {
                    if (err) throw err;
                    response.writeHead(301, { Location: `/?id=${result.insertId}` });
                    response.end();
                });
        });
    
}


exports.update = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;

    db.query(`select * from topic`, (err, topics) => {
        if(err) throw err;
        db.query('select * from topic where id = ?', queryData.id, (err2, topic) => {
            if(err2) throw err2;
            db.query(`select * from author`, (err3, authors) => {
                var list = template.list(topics);
                var html = template.html(sanitizeHTML(topic[0].title), list,
                    `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic[0].title)}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea>
                    </p>
                    <p>
                        <select name="author">
                            ${template.authorSelect(authors, topic[0].author_id)}
                        </select>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    
                    </form>`,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>
                    `);
                response.writeHead(200);
                response.end(html);
            });
            
            
        });
        
    });
    
}


exports.update_process = (request, response) => {
    
    var body = '';

    request.on('data', (data) => {
        body = body + data;
    });

    request.on('end', () => {
        const post = qs.parse(body);

        db.query(`update topic 
                    set title = ?, description = ?, author_id = ? where id = ?`,
            [post.title, post.description, post.author, post.id],
            (err, result) => {
                if (err) throw err;
                console.log(result);
                response.writeHead(301, { Location: `/?id=${post.id}` });
                response.end();
            });

    });
    
}

exports.delete_process = (request, response) => {
    var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            
            db.query(`delete from topic where id = ?`, [post.id], (err, result) => {
                if(err) throw err;
                response.writeHead(301, {Location: `/`});
                response.end();
            });
        });
}