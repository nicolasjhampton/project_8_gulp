'use strict';

var gulp = require('gulp')
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');

gulp.task('scripts', function() {
    var tsResult = gulp.src(['src/js/**/*.ts', 'typings/**/*.ts'])
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            sortOutput: true,
            module: 'umd'
        }));

    return tsResult.js
        .pipe(concat('all.min.js')) // You can use other plugins that also support gulp-sourcemaps
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('lint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint({ jquery: true }))
    .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
  return gulp.src('./src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('all.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('images', function() {
	return gulp.src('./src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/content'));
});

gulp.task('clean', function () {
	return gulp.src(['./dist/scripts/*.js',
                   './dist/images/*',
                   './dist/styles/*.css',
                   './dist/*.html'], {read: false})
		.pipe(clean());
});

gulp.task('templates', function() {
  gulp.src('./src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('build', ['clean', 'lint', 'images', 'styles', 'templates', 'scripts']);

gulp.task('default', ['build']);
