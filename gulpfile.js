var gulp = require('gulp'),
    watch = require('gulp-watch'),
//stylus = require('gulp-stylus'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    csscomb = require('gulp-csscomb'),
    nano = require('gulp-cssnano'),
    changed = require('gulp-changed'),
    connect = require('gulp-connect'),
    nib = require('nib');


//gulp.task('stylus', function () {
//	gulp.src('./css**/*.styl')
//			.pipe(stylus({use: nib(), compress: false}))
//			.on('error', console.log)
//			.pipe(gulp.dest('./css/'));
//});

gulp.task('connect', function () {
  connect.server({
    root: '',
    livereload: true
  });
});

gulp.task('less', function () {
  gulp.src(['./css/**/*.less', '!./vendors/**'])
      .pipe(changed('./css/**/*.less'))
      .pipe(plumber())
      .pipe(less({use: nib(), compress: false}))
      .on('error', console.log)
      .pipe(csscomb())
      .pipe(gulp.dest('./css/'))
      .pipe(connect.reload());
});

gulp.task('less-min', function () {
  gulp.src(['./css/**/*.less', '!./css/vendors/**'])
    //.pipe(changed('app', {extension: '.css'}))
      .pipe(plumber())
      .pipe(less({use: nib(), compress: true}))
      .on('error', console.log)
      .pipe(rename({suffix: '.min'}))
      .pipe(csscomb())
      .pipe(nano())
      .pipe(gulp.dest('./css/'));
});

gulp.task('imagemin', function () {
  gulp.src(['./css/**/*'])
      .pipe(plumber())
      .pipe(imagemin({
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('./css/'));
});

gulp.task('spritesmith', function () {
  var spriteData =
      gulp.src(['./css/images/sprites/images/*.*'])
          .pipe(changed('./css/images/sprites/images/*.*'))
          .pipe(plumber())
          .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'style.css',
            algorithm: 'top-down',
            padding: 2
          }));

  spriteData.img
      .pipe(gulp.dest('./css/images/sprites/'))
      .pipe(connect.reload());
  spriteData.css
      .pipe(gulp.dest('./css/images/sprites/'))
      .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src(
      [
        './index.html'
      ])
      .pipe(connect.reload());
});

gulp.task('watch', function () {
  //gulp.watch('./css/**/*.styl', ['stylus']);
  gulp.watch('./css/**/*.less', ['less']);
  gulp.watch('./css/**/*.less', ['less-min']);

  gulp.watch([
    './index.html'
  ], ['html']);

  //gulp.watch('./css/', ['imagemin']);
  //gulp.watch('./css/images/sprites/images/*', ['spritesmith']);

  watch('./css/images/sprites/images/*.*', function () {
    gulp.start('spritesmith');
  });
});

gulp.task('default', ['connect', 'less', 'less-min', 'imagemin', 'spritesmith', 'watch']);
