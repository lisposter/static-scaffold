var gulp = require('gulp');
var jade = require('gulp-jade');
var copy = require('gulp-copy');

var cfg = require('./config');

gulp.task('templates-jade', function() {
    gulp.src(cfg.root + '/' + cfg.views + '/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('copy-static', function() {
    gulp.src(cfg.root + '/' + cfg.statics + '/**/*')
        .pipe(copy('./dist', { prefix: 2 }))
})