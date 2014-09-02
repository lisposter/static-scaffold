var path = require('path');

var gulp = require('gulp');
var jade = require('gulp-jade');
var swig = require('gulp-swig');
var less = require('gulp-less');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var copy = require('gulp-copy');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var revOutdated = require('gulp-rev-outdated');
var cleaner = require('gulp-rimraf');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var del = require('del');

var cfg = require('./config');

gulp.task('jade', function() {
    return gulp.src(cfg.src + '/' + cfg.views + '/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('swig', function() {
    return gulp.src(cfg.src + '/' + cfg.views + '/**/*.html')
        .pipe(swig())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {
    return gulp.src(cfg.src + '/' + cfg.scripts + '/**/*.js')
        .pipe(copy('./dist/js', { prefix: 2 }));
});

gulp.task('less', function() {
    return gulp.src(path.join(cfg.src, cfg.assets, cfg.less) + '/**/*.less')
        //.pipe(watch())
        .pipe(less())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass', function() {
    return gulp.src(path.join(cfg.src, cfg.assets, cfg.sass) + '/**/*')
        //.pipe(watch())
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'));
});

// devide copy task(css, less, img...)
gulp.task('copy-assets', function() {
    var assetsFilter = filter(['*', '!*less*', '!*sass*', '!*scss*']);
    gulp.src(cfg.src + '/' + cfg.assets + '/**/*')
        .pipe(assetsFilter)
        .pipe(copy('./dist', { prefix: 2 }));
});

gulp.task('ref', ['dist'], function() {
    var jsFilter = filter('**/*.js');
    var cssFilter = filter('**/*.css');

    var assets = useref.assets();
    return gulp.src('./dist/**/*.html')
        .pipe(assets)     
        .pipe(jsFilter)
        .pipe(uglify())           
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(minifyCss())
        .pipe(cssFilter.restore())
        .pipe(rev())           
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())      
        .pipe(gulp.dest('./dist/'));
});

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
});

gulp.task('clean', function(cb) {
    del([
        'dist/**'
    ], cb);
});

gulp.task('clean:js', ['ref'], function(cb) {
    del([ 'dist/js/**/*.js', '!dist/js/combined-*.js'], cb);
});

gulp.task('clean:css', ['ref'], function(cb) {
    del([ 'dist/css/**/*.css', '!dist/css/combined*'], cb);
});

gulp.task('clean:combined', ['ref'], function() {
    gulp.src(['dist/js/combined*.js'], { read: false })
        .pipe(revOutdated(1))
        .pipe(cleaner());

    gulp.src(['dist/css/combined*.css'], { read: false })
        .pipe(revOutdated(1))
        .pipe(cleaner());
});

gulp.task('dist', [cfg.tplengine, 'copy-assets', 'jade', 'swig', 'js', 'less', 'sass'], function(done) {
    done();
});

gulp.task('build', ['ref', 'clean:js', 'clean:css', 'clean:combined']);

gulp.task('live', ['server', 'sass', 'less', 'watch']);

