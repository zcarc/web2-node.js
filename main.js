var fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');


const helmet = require('helmet');


const app = express();

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());

app.use(session({
    secret: 'sdfgohu94RGT430#$^',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
}));

app.use(flash());  


const passport = require('./lib/passport')(app);

// app.use()를 사용하면 모든 라우터의 요청에 대해 readdir이 실행되는데
// app.get()은 get요청에 대한 라우터에서만 실행되고, 첫번째 인자의 '*'는 모든 요청에 대해서만 콜백함수를 실행한다.
// Express에서는 app.use()만 미들웨어라고 생각되었지만 app.get()도 미들웨어이다. 즉, 모든 라우터가 미들웨어이다.
app.get('*', (request, response, next) => {

    fs.readdir('./data', (err, fileList) => {
        request.list = fileList;
        next();
    });
});

const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);


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

