var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	complexity = require('./index');

gulp.task('default', function(){
	return gulp.src('index.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(complexity());
});