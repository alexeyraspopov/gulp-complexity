/* jshint node:true */
var cr = require('complexity-report'),
	map = require('map-stream'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError;

function log(file, report){
	console.log(' ');
	console.log(file.path);
	console.log('    ', 'maintainability:', report.maintainability.toFixed(2));
	console.log('    ', 'cyclomatic:', report.aggregate.complexity.cyclomatic);
	console.log('    ', 'halstead difficulty:', report.aggregate.complexity.halstead.difficulty);
}

function complexity(options){
	options = options || {
		cyclomatic: [3, 7, 12],
		halstead: [8, 13, 20],
		maintainability: 100
	};

	return map(function(file, cb){
		if(file.isNull()){
			return cb(null, file);
		}

		if(file.isStream()){
			return cb(new PluginError('gulp-complexity', 'Streaming not supported'));
		}

		var report = cr.run(file.contents.toString(), options);

		log(file, report);

		cb(null, file);
	});
}

module.exports = complexity;