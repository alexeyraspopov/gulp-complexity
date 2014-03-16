/* jshint node:true */
var cr = require('complexity-report'),
	map = require('map-stream'),
	gutil = require('gulp-util'),
	reporter = require('./reporter'),
	PluginError = gutil.PluginError;

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

		reporter.log(file, report, options);

		cb(null, file);
	});
}

module.exports = complexity;