var fs = require('fs');

var koa = require('koa');
var common = require('koa-common');
var views = require('koa-views');
var router = require('koa-router');

var app = koa();

var cfg = require('./config');
var viewsOpts = require('./lib/views-options');

app.use(views(__dirname + '/' + cfg.root + '/' + cfg.views, viewsOpts[cfg.tplengine]));

app.use(router(app));

// handle index page
app.get('/', function* (next) {
    yield this.render('index');
});


// handle other pages
app.get(/.*\.html|.*\.htm|^\/$/, function* (next) {
    var url = this.request.url;
    var tpl = /.*\.html/.exec(url)[0].slice(1).replace(/\.html$/, '');
    yield this.render(tpl);
})

app.use(common.static(__dirname + cfg.root + '/' + cfg.statics));

app.listen(cfg.port);
console.log('Server started at: http://localhost:' + cfg.port);