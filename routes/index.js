const template = require('../lib/template');

const express = require('express');
const router = express.Router();


router.get('/', (request, response) => {

    var title = 'Welcome';
    var data = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<h2>${title}</h2>
        <p>${data}</p>
        <img src='/images/building.jpg' style='width: 500px;'>`,
        `<a href="/topic/create">create</a>`);
    response.send(html);
});

module.exports = router;