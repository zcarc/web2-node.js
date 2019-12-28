const qs = require('querystring');
const url = require('url');
const db = require('./db');
const template = require('./template');
const sanitizeHTML = require('sanitize-html');

exports.home = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from author`, (err, data) => {

            var title = 'Welcome';
            var list = template.list(topics);
            var html = template.html(title, list,
                
                `${template.tableRows(data)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border: 1px solid black;
                        padding: 3px;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>

                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>

                    <p>
                        <button>create</button>
                    </p>
                </form>`,
                ``);
                
            response.writeHead(200);
            response.end(html);
        });
    });
}


exports.create_process = (request, response) => {
    var body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = qs.parse(body);
            
            db.query(`insert into author (name, profile) values(?, ?)`, [post.name, post.profile], (err, result) => {
                if(err) throw err;
                response.writeHead(301, {Location: `/author`});
                response.end();
            });
        });
}


exports.update = (request, response) => {
    db.query(`select * from topic`, (err, topics) => {
        db.query(`select * from author`, (err, authors) => {
            const queryData = url.parse(request.url, true).query;
            db.query(`select * from author where id = ?`, [queryData.id], (err, author) => {

                const title = 'Author';
                const list = template.list(topics);
                const html = template.html(title, list,
                    
                `${template.tableRows(authors)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border: 1px solid black;
                        padding: 3px;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <input type="hidden" name="id" value=${queryData.id}>
                    <p>
                        <input type="text" name="name" value=${sanitizeHTML(author[0].name)}>
                    </p>

                    <p>
                        <textarea name="profile">${sanitizeHTML(author[0].profile)}</textarea>
                    </p>

                    <p>
                        <button>update</button>
                    </p>
                </form>`,
                ``);
                
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
            console.log('post: ', post);
            
            db.query(`update author set name = ? , profile = ? where id = ?`, [post.name, post.profile, post.id], (err, result) => {
                if(err) throw err ;
                response.writeHead(301, {Location: `/author`});
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
            console.log('body: ', body);
            console.log('post: ', post);
            
            db.query(`delete from topic where author_id = ?`, [post.id], (err, result) => {
                if(err) throw err;
                
                db.query(`delete from author where id = ?`, [post.id], (err, result) => {
                    if(err) throw err ;
                    response.writeHead(301, {Location: `/author`});
                    response.end();
                });
            });
            
        });
}