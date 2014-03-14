# [gulp](https://github.com/wearefractal/gulp)-complexity

> Analize the complexity and maintainability of code

*Twin brother of [grunt-complexity](https://github.com/vigetlabs/grunt-complexity) task*

***NOTE: Work In Progress***

## Install

**TODO**: register package

	npm install --save-dev alexeyraspopov/gulp-complexity

## Example

	var gulp = require('gulp'),
		complexity = require('gulp-complexity');

	gulp.task('default', function(){
		return gulp.src('*.js')
			.pipe(complexity());
	});

## Options

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License) (c) Alexey Raspopov


