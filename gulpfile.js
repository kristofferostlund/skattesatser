
var open = require('gulp-open');
var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');


// Watches the back-end stuff and restarts the server on saves.
gulp.task('serve', function () {
  nodemon({
    script: './server/app.js'
  });
});

// Watches the front-end stuff and refreshes it.
gulp.task('watch', function () {
  gulp.watch('public/**.*', function () {
    // livereload();
    gulp.src('')
    // .pipe(console.log('Reloading browser, please wait...'))
    .pipe(livereload());
  });
  
});

// Open the web browser.
gulp.task('open', function () {
  gulp.src('')
  .pipe(open({uri: 'http://localhost:3000'}));
});

// livereload({ start: true });
livereload.listen();
gulp.task('default', ['open', 'watch', 'serve']);