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
var livereload = require('gulp-livereload');
var del = require('del');

var cfg = require('./config');

gulp.task('jade', function() {
    return gulp.src(cfg.src + '/' + cfg.views + '/**/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('./temp/'));
});

gulp.task('swig', function() {
    return gulp.src(cfg.src + '/' + cfg.views + '/**/*.html')
        .pipe(swig())
        .pipe(gulp.dest('./temp/'));
});

gulp.task('js', function() {
    return gulp.src(cfg.src + '/' + cfg.scripts + '/**/*.js')
        .pipe(copy('./temp/' + cfg.scripts, { prefix: 2 }));
});

gulp.task('less', function() {
    return gulp.src(path.join(cfg.src, cfg.assets, cfg.less) + '/**/*.less')
        //.pipe(watch())
        .pipe(less())
        .pipe(gulp.dest('./temp/css'))
        .pipe(livereload());
});

gulp.task('sass', function() {
    return gulp.src(path.join(cfg.src, cfg.sass) + '/**/*')
        //.pipe(watch())
        .pipe(sass())
        .pipe(gulp.dest('./temp/css'))
        .pipe(livereload());
});

// devide copy task(css, less, img...)
gulp.task('copy:temp', function() {
    return gulp.src(cfg.src + '/' + cfg.assets + '/**/*')
        .pipe(copy('./temp', { prefix: 2 }));
});

// TODO: skip css, js which has been combined
gulp.task('copy:dist', function() {
    return gulp.src(cfg.src + '/' + cfg.assets + '/**/*')
        .pipe(copy('./dist', { prefix: 2 }));
});

gulp.task('ref', ['dist'], function() {
    var jsFilter = filter('**/*.js');
    var cssFilter = filter('**/*.css');

    var assets = useref.assets();
    return gulp.src('./temp/**/*.html')
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

gulp.task('review', function() {
    var app = require('./app-dist');
    app.listen(process.env.PORT || cfg.port + 1);
});

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch(path.join(cfg.src, cfg.less) + '/**/*', ['less']);

    gulp.watch(path.join(cfg.src, cfg.sass) + '/**/*', ['sass']);
});

gulp.task('clean', function(cb) {
    del([
        'dist/**'
    ], cb);
});

gulp.task('clean:temp', ['dist', 'copy:dist', 'clean:combined'], function(cb) {
    del([
        'temp/**'
    ], cb);
});

gulp.task('clean:combined', ['ref'], function() {
    gulp.src(['dist/js/combined*.js'], { read: false })
        .pipe(revOutdated(1))
        .pipe(cleaner());

    gulp.src(['dist/css/combined*.css'], { read: false })
        .pipe(revOutdated(1))
        .pipe(cleaner());
});

gulp.task('dist', [cfg.tplengine, 'copy:temp', 'jade', 'swig', 'js', 'less', 'sass'], function(done) {
    done();
});

gulp.task('build', ['clean', 'ref', 'copy:dist', 'clean:combined', 'clean:temp']);

gulp.task('live', ['server', 'sass', 'less', 'watch']);

