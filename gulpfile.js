'use strict';
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  clean = require('gulp-clean'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  stylus = require('gulp-stylus'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  jade = require('gulp-jade'),
  express = require('express'),
  serveIndex = require('serve-index'),
  serveStatic = require('serve-static'),
  http = require('http'),
  plumber = require('gulp-plumber'),
  opn = require('opn'),
  pkg = require('./package.json'),
  browserify = require('gulp-browserify'),
  through = require('through'),
  path = require('path'),
  ghpages = require('gh-pages'),
  template = require('lodash').template,
  jiraWebComponentMiddleware = require(__dirname + '/lib/jiraWebComponent').Middleware,
  isDemo = process.argv.indexOf('demo') > 0;

gulp.task('default', ['clean', 'compile']);
gulp.task('demo', ['compile', 'watch', 'connect']);
gulp.task('compile', ['compile:lib', 'compile:demo']);
gulp.task('compile:lib', ['browserify:lib']);
gulp.task('compile:demo', ['jade', 'browserify:demo']);

gulp.task('watch', function() {
  gulp.watch(['lib/*','config.j*'], ['compile:lib', 'browserify:demo']);
  gulp.watch(['demo/src/*.jade'], ['jade']);
  gulp.watch('demo/src/**/*.js', ['browserify:demo']);
  //gulp.watch('lib/src/*.jade', ['jade:lib']); // covered by lib*
  gulp.watch('dist/src/*.html', ['browserify']);
});

gulp.task('watch:lib', function() {
  gulp.watch('lib/*', ['compile:lib']);
});

gulp.task('clean', ['clean:browserify', 'clean:stylus', 'clean:jade']);
gulp.task('clean:browserify', ['clean:browserify:lib', 'clean:browserify:demo']);

gulp.task('clean:browserify:lib', function() {
  return gulp.src(['dist/jiraWebComponent*'], { read: false })
    .pipe(clean());
});

gulp.task('clean:browserify:demo', function() {
  return gulp.src(['demo/dist/build'], { read: false })
    .pipe(clean());
});

gulp.task('clean:stylus', function() {
  return gulp.src(['lib/tmp'], { read: false })
    .pipe(clean());
});

gulp.task('clean:jade', function() {
  return gulp.src(['demo/dist/index.html'], { read: false })
    .pipe(clean());
});

gulp.task('clean:jade:lib', function() {
  return gulp.src(['dist/src/*.html'], { read: false })
    .pipe(clean({force:true}));
});

gulp.task('stylus', ['clean:stylus'], function() {
  return gulp.src('lib/theme.styl')
    .pipe(isDemo ? plumber() : through())
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules']
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(csso())
    .pipe(gulp.dest('lib/tmp'));
});

gulp.task('browserify', ['browserify:lib', 'browserify:demo']);

gulp.task('browserify:lib', ['clean:browserify:lib', 'stylus', 'jade:lib'], function() {
  return gulp.src('lib/jiraWebComponentFrontend.js')
    .pipe(isDemo ? plumber() : through())
    .pipe(browserify({ transform: ['brfs'], standalone: 'jiraWebComponent'  }))
    .pipe(header(template([
      '/*!',
      ' * <%= name %> v<%= version %>',
      ' *',
      ' * Copyright <%= new Date().getFullYear() %>, <%= author.name %>',
      ' * This content is released under the <%= licenses[0].type %> license',
      ' * <%= licenses[0].url %>',
      ' */\n\n'
    ].join('\n'), pkg)))
    .pipe(gulp.dest('dist'))
    .pipe(rename('jiraWebComponentFrontend.min.js'))
    .pipe(uglify())
    .pipe(header(template([
      '/*! <%= name %> v<%= version %> ',
      '© <%= new Date().getFullYear() %> <%= author.name %>, ',
      '<%= licenses[0].type %> License */\n'
    ].join(''), pkg)))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify:demo', ['clean:browserify:demo'], function() {
  return gulp.src('demo/src/scripts/main.js')
    .pipe(isDemo ? plumber() : through())
    .pipe(browserify({ transform: ['brfs'] }))
    .pipe(rename('build.js'))
    .pipe(gulp.dest('demo/dist/build'))
    //.pipe(connect.reload())
    ;
});

gulp.task('jade', ['clean:jade'], function() {
  return gulp.src('demo/src/index.jade')
    .pipe(isDemo ? plumber() : through())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('demo/dist'))
    //.pipe(connect.reload())
    ;
});

gulp.task('jade:lib', ['clean:jade:lib'], function() {
  return gulp.src('lib/src/*.jade')
    .pipe(isDemo ? plumber() : through())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('dist/src'))
    //.pipe(connect.reload())
    ;
});

gulp.task('connect', ['compile'], function(done) {
  var app, server;
  app = express();
  server = http.createServer(app);


  app.use(serveStatic('demo/dist'));
  app.use(serveIndex('demo/dist'));
  app.get('/jiraSearch/:filterID', jiraWebComponentMiddleware({
    filterParam:'filterID',
    user: 'coledi',
    password: 'Ohkuninushi_'
  }));

  server.listen(8080);

  opn('http://localhost:8080', done);
});

gulp.task('deploy', ['compile:demo'], function(done) {
  ghpages.publish(path.join(__dirname, 'demo/dist'), { logger: gutil.log }, done);
});

gulp.task('serve', ['connect', 'watch']);



