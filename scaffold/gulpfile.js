var gulp = require('gulp');
var jade = require('gulp-jade');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

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

gulp.task('server', function() {
    var app = require('./app');
    app.listen(process.env.PORT || cfg.port);
});

gulp.task('watch', function() {
    var server = livereload();
    server.changed();
    gulp.watch('src/views/**').on('change', function(file) {
        server.changed(file.path);
    });
})

gulp.task('live', ['server', 'watch'])