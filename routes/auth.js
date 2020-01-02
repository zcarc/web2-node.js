const template = require('../lib/template');
const express = require('express');
const router = express.Router();


module.exports = (passport) => {

    router.get('/login', (request, response) => {
        const fmsg = request.flash();
        console.log('login');
        let feedback = '';
        if (fmsg.error) {
            feedback = fmsg.error[0];
        }

        var title = 'WEB - login';
        var list = template.list(request.list);
        var html = template.html(title, list,
            `<div style='color: red;'>${feedback}</div>
            <form action="/auth/login_process" method="post">
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


    router.post('/login_process',
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true,
            successFlash: true,
        })
    );


    router.get('/logout', (request, response) => {

        request.logout();
        // request.session.destroy((err) => {
        //     response.redirect('/');
        // });
        request.session.save(() => {
            response.redirect(`/`);
        });

    });

    return router;
};