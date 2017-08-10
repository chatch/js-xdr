'use strict';

var babel       = require('gulp-babel');
var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var uglify      = require('gulp-uglify');
var webpackStream = require('webpack-stream');

gulp.task('default', ['build']);

gulp.task('lint:src', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

// Lint our test code
gulp.task('lint:test', function() {
  return gulp.src(['test/unit/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('build', function(done) {
  runSequence('clean', 'build:node', 'build:browser', done);
});

gulp.task('test', function(done) {
  runSequence('clean', 'test:node', 'test:browser', done);
});


gulp.task('hooks:precommit', ['build'], function() {
  return gulp.src(['dist/*', 'lib/*'])
    .pipe(plugins.git.add());
});

gulp.task('build:node', ['lint:src'], function() {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'));
});

gulp.task('build:browser', ['lint:src'], function() {
  return gulp.src('src/browser.js')
    .pipe(webpackStream({
      output: { library: 'XDR' },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {loader: 'babel-loader', options: {presets: ['env']}}
          }
        ]
      },
    }))
    .pipe(plugins.rename('xdr.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(plugins.rename('xdr.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test:node', function() {
  return gulp.src(["test/setup/node.js", "test/unit/**/*.js"])
    .pipe(plugins.mocha({
      compilers: ['js:babel-register'],
      reporter: ['dot']
    }));
});

gulp.task('test:browser', ["build:browser"], function (done) {
  var karma = require('karma').server;

  karma.start({ configFile: __dirname + '/karma.conf.js' }, done);
});

gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
      .pipe(plugins.rimraf());
});

gulp.task('watch', ['build'], function() {
  gulp.watch('lib/**/*', ['build']);
});

gulp.task('submit-coverage', function(cb) {
  return gulp
      .src("./coverage/**/lcov.info")
      .pipe(plugins.coveralls());
});
