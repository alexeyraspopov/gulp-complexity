var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	complexity = require('./index');

gulp.task('default', function(){
	return gulp.src(['index.js', 'reporter.js', 'reporter-helpers.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(complexity());
});

gulp.task('test', function(){
	return gulp.src(['test.js', 'index.js', 'reporter.js', 'reporter-helpers.js'])
		.pipe(complexity())
		// .pipe(gulp.dest('build'));
});