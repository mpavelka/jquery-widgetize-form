// including plugins
var gulp   = require('gulp'),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	watch = require("gulp-watch"),
	browserify = require('gulp-browserify');

var index = './src/index.js';
var basename = 'jquery-widgetize-form'
var dist = './dist'


gulp.task('release-debug', function () {
	return gulp
		.src(index)
		.pipe(browserify({
			insertGlobals : false,
			debug : true
		}))
		.pipe(rename({
			'basename': basename,
		}))
		.pipe(gulp.dest(dist));
});


gulp.task('release', function () {
	return gulp
		.src(index)
		.pipe(browserify({
			insertGlobals : false,
			debug : false,
		}))
		.pipe(uglify())
		.pipe(rename({
			'basename': basename,
			'suffix' : '.min',
		}))
		.pipe(gulp.dest(dist));
});


gulp.task('devel', function() {
	watch(['src/*.js', 'src/**/*.js'], function(){
		gulp.start('release-debug');
	});
});