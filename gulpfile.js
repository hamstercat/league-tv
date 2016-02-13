var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cp = require('child_process'),
    plumber = require('gulp-plumber');

gulp.task('jekyll', function (done) {
  browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
  return cp.spawn('jekyll', ['build'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('rebuild-jekyll', ['jekyll'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'font', 'jekyll'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
gulp.task('sass', function () {
  return gulp.src('_sass/main.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: ['sass']
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('css'));
});

gulp.task('font', function () {
  return gulp.src('node_modules/font-awesome/fonts/**')
    .pipe(gulp.dest('fonts'));
});

gulp.task('watch', function () {
  gulp.watch('_sass/*.scss', ['sass']);
  gulp.watch(['_config.yml', '*.html', '_layouts/*.html', '_includes/*.html', '_posts/*.html', 'images/*'], ['rebuild-jekyll']);
});

gulp.task('default', ['browser-sync', 'watch']);
