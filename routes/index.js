const template = require('../lib/template');
const auth = require('../lib/auth');

const express = require('express');
const router = express.Router();




router.get('/', (request, response) => {

    console.log('/', request.user);

    const fmsg = request.flash();
    console.log('"/" fmsg', fmsg);
    let feedback = '';
    if(fmsg.success) {
        feedback = fmsg.success[0];
    }

    var title = 'Welcome';
    var data = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.html(title, list,
        `<div style='color: blue;'>${feedback}</div>
        <h2>${title}</h2>
        <p>${data}</p>
        <img src='/images/building.jpg' style='width: 500px;'>`,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response));

    response.send(html);
});

module.exports = router;