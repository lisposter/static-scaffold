'use strict';

var path = require('path');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var vinylPaths = require('vinyl-paths');

var cfg = require('./config');

gulp.task('jade', function() {
  return gulp.src(cfg.src + '/' + cfg.views + '/**/*.jade')
    .pipe(plugins.jade({pretty: true}))
    .pipe(gulp.dest('./temp/'));
});

gulp.task('swig', function() {
  return gulp.src(cfg.src + '/' + cfg.views + '/**/*.html')
    .pipe(plugins.swig())
    .pipe(gulp.dest('./temp/'));
});

gulp.task('js', function() {
  return gulp.src(cfg.src + '/' + cfg.scripts + '/**/*.js')
    .pipe(plugins.copy('./temp/' + cfg.scripts, { prefix: 2 }));
});

gulp.task('less', function() {
  return gulp.src(path.join(cfg.src, cfg.less) + '/**/*.less')
    //.pipe(watch())
    .pipe(plugins.less())
    .pipe(gulp.dest('./temp/css'))
    .pipe(plugins.livereload());
});

gulp.task('sass', function() {
  return gulp.src(path.join(cfg.src, cfg.sass) + '/**/*')
    //.pipe(watch())
    .pipe(plugins.sass())
    .pipe(gulp.dest('./temp/css'))
    .pipe(plugins.livereload());
});

// devide copy task(css, less, img...)
gulp.task('copy:temp', function() {
  return gulp.src(cfg.src + '/' + cfg.assets + '/**/*')
    .pipe(plugins.copy('./temp', { prefix: 2 }));
});

// TODO: skip css, js which has been combined
gulp.task('copy:dist', function() {
  return gulp.src(cfg.src + '/' + cfg.assets + '/**/*')
    .pipe(plugins.copy('./dist', { prefix: 2 }));
});

gulp.task('ref', ['dist'], function() {
  var jsFilter = plugins.filter('**/*.js');
  var cssFilter = plugins.filter('**/*.css');

  var assets = plugins.useref.assets();
  return gulp.src('./temp/**/*.html')
    .pipe(assets)
    .pipe(jsFilter)
    .pipe(plugins.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(plugins.minifyCss())
    .pipe(cssFilter.restore())
    .pipe(plugins.rev())
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(plugins.revReplace())
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
  plugins.livereload.listen();

  gulp.watch(cfg.src + '/' + cfg.views + '/**/*').on('change', function(file) {
    plugins.livereload.changed(file.path);
  });

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
    .pipe(plugins.revOutdated(1))
    .pipe(vinylPaths(del));

  gulp.src(['dist/css/combined*.css'], { read: false })
    .pipe(plugins.revOutdated(1))
    .pipe(vinylPaths(del));
});

gulp.task('dist', [cfg.tplengine, 'copy:temp', 'jade', 'swig', 'js', 'less', 'sass'], function(done) {
  done();
});

gulp.task('build', ['clean', 'ref', 'copy:dist', 'clean:combined', 'clean:temp']);

gulp.task('live', ['server', 'sass', 'less', 'watch']);

