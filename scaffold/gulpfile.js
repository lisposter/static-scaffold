var path = require('path');

var gulp = require('gulp');
var jade = require('gulp-jade');
var swig = require('gulp-swig');
var less = require('gulp-less');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var del = require('del');

var cfg = require('./config');

gulp.task('templates-jade', function() {
    gulp.src(cfg.src + '/' + cfg.views + '/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('templates-swig', function() {
    gulp.src(cfg.src + '/' + cfg.views + '/**/*.html')
        .pipe(swig())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('compile-less', function() {
    gulp.src(path.join(cfg.src, cfg.assets, cfg.less) + '/**/*.less')
        .pipe(watch())
        .pipe(less())
        .pipe(gulp.dest('./dist/css'))
})

// devide copy task(css, less, img...)
gulp.task('copy-static', function() {
    gulp.src(cfg.src + '/' + cfg.assets + '/**/*')
        .pipe(copy('./dist', { prefix: 2 }))
})

gulp.task('server', function() {
    var app = require('./app');
    app.listen(process.env.PORT || cfg.port);
});

gulp.task('watch', function() {less
    gulp.watch('src/assets/less/**/*.less', ['compile-less']);

    var server = livereload();
    server.changed();
    gulp.watch('src/**').on('change', function(file) {
        server.changed(file.path);
    });
})

gulp.task('clean', function(cb) {
    del([
        'dist/**'
    ], cb);
})


gulp.task('build', ['templates-' + cfg.tplengine, 'copy-static', 'compile-less']);

gulp.task('live', ['server', 'watch'])

