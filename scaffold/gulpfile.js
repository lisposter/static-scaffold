var path = require('path');

var gulp = require('gulp');
var jade = require('gulp-jade');
var swig = require('gulp-swig');
var less = require('gulp-less');
var sass = require('gulp-sass');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var del = require('del');

var cfg = require('./config');

gulp.task('jade', function() {
    gulp.src(cfg.src + '/' + cfg.views + '/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('swig', function() {
    gulp.src(cfg.src + '/' + cfg.views + '/**/*.html')
        .pipe(swig())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('less', function() {
    gulp.src(path.join(cfg.src, cfg.assets, cfg.less) + '/**/*.less')
        .pipe(watch())
        .pipe(less())
        .pipe(gulp.dest('./dist/css'))
})

gulp.task('sass', function() {
    gulp.src(path.join(cfg.src, cfg.assets, cfg.sass) + '/**/*')
        .pipe(watch())
        .pipe(sass())
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

gulp.task('watch', function() {
    gulp.watch('src/assets/less/**/*.less', ['less']);

    gulp.watch('src/assets/sass/**/*', ['sass']);

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


gulp.task('build', [cfg.tplengine, 'copy-static', 'compile-less']);

gulp.task('live', ['server', 'sass', 'less', 'watch'])

