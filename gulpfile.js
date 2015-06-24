var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	complexity = require('./index');

gulp.task('default', function(){
	return gulp.src('src/*')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(complexity());
});

gulp.task('test', function(){
	return gulp.src(['test/*', 'index.js', 'src/*'])
		.pipe(complexity())
		// .pipe(gulp.dest('build'));
});
