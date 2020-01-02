module.exports = (app) => {

    var authData = {
        email: '123@123.123',
        password: '123',
        nickname: 'authTest',
    }
    
    var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    // LocalStrategy에서 done(null, user)를 호출하면 serializeUser() 메소드가 호출된다.
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user);

        // 세션 스토어에 저장한다.
        done(null, user.email);
    });

    passport.deserializeUser(function (id, done) {

        // 여기의 id
        console.log('deserializeUser', id);

        // req.user에 저장된다.
        // '/' 경로에서 req.user를 호출하면 done()의 유저 정보가 들어있다.
        done(null, authData);

        // User.findById(id, function (err, user) {
        //     done(err, user);
        // });
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd',
        },
        function (username, password, done) {
            console.log('LocalStrategy', username, password);

            if (authData.email === username) {
                console.log(1);
                if (authData.password === password) {
                    console.log(2);
                    return done(null, authData, { message: 'Login Success' });

                } else {
                    console.log(3);
                    return done(null, false, { message: 'Incorrect password.' });
                }

            } else {
                console.log(4);
                return done(null, false, { message: 'Incorrect username.' });
            }

        }
    ));

    return passport;

}

