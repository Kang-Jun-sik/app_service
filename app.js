var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());

app.use('/api/script', (req, res) => {
    let script = '(function(dews, gerp) {\n' +
        '  var module = {};\n' +
        '\n' +
        '  //////// 작성 영역 - 시작 ////////\n' +
        '  var moduleCode = \'Development\'; // 모듈 코드를 입력 해주세요.\n' +
        '\n' +
        '  // 공통 함수 정의\n' +
        '  module.myModuleFunction = function() {\n' +
        '    console.log(\'## My Module Function ##\');\n' +
        '  };\n' +
        '\n' +
        '  console.log(\'## Script Loaded!!! ##\');\n' +
        '\n' +
        '  //////// 작성 영역 - 끝 ////////\n' +
        '\n' +
        '  var newModule = {};\n' +
        '  newModule[moduleCode] = module;\n' +
        '  window.gerp = Object.assign(gerp, newModule);\n' +
        '})(window.dews, window.gerp || {});\n';
    res.json(script);
});
app.use('/api/htmlData', (req, res) => {
    let html = '<div><h1>변환 텍스트</h1></div>';
    res.json(html);
});
app.use('/api/success', (req, res) => {
    // res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    // res.append('Access-Control-Allow-Origin', ['*']);
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.json({
        state: 200,
        data: [{a: 'b', b: 'c'}]
    })
});
app.use('/api/baseData', (req, res) => {
    const jsonData = [
        {emp_id: '1', name: '이철수', age: 32, address: '서울'},
        {emp_id: '2', name: '김변헌', age: 30, address: '광주'},
        {emp_id: '3', name: '김진현', age: 31, address: '부산'},
        {emp_id: '4', name: '안지만', age: 27, address: '서울'},
        {emp_id: '5', name: '홍가은', age: 33, address: '삼척'}
    ];
    res.json(jsonData);
});
app.use('/api/batchSave', (req, res) => {
    if (req.data) {
        console.log(req.data);
    }

   const jsonData = [
       {emp_id: '1', name: '이철수'}
   ];

   res.json(jsonData);
});
app.use('/api/apiData', (req, res) => {
    const jsonData = {
        state: 'success',
        data: [
            {id: '1', name: '김철수', age: 32},
            {id: '2', name: '김정호', age: 30},
            {id: '3', name: '김현홍', age: 31},
            {id: '4', name: '홍채은', age: 33}
        ]
    };
    res.json(jsonData);
});
app.use('/api/ajaxData', (req, res) => {
    // console.log(req.body);
    let jsonData = [
        {name: '김철수', age: 32},
        {name: '김정호', age: 30},
        {name: '김현홍', age: 31},
        {name: '홍채은', age: 33}
    ];
    const data = [
        {name: '제임스', age: 22}
    ];
    // if (req.query.id === '1') {
    //     console.log(req.query);
    //     jsonData = data;
    // }
    // if (req.body.name === '제임스') {
    //     if (req.data.name === '제임스') {
    //         jsonData = data;
    //     }
    // }

    res.json(jsonData);
});
app.use('/api/errorAPIData', (req, res) => {
    const jsonData = {
        state: 'error',
        message: 'Error!!!',
        data: [
            {name: '김철수', age: 32},
            {name: '김정호', age: 30},
            {name: '김현홍', age: 31},
            {name: '홍채은', age: 33}
        ]
    };
    res.json(jsonData);
});
app.use('/api/errorData', (req, res, next) => {
    next('Error');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({status: 500, message: 'internal error', type: 'internal'});
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
