/* jshint node:true */
var cr = require('complexity-report'),
	map = require('map-stream'),
	through = require('through2'),
	gutil = require('gulp-util'),
	reporter = require('./reporter'),
	PluginError = gutil.PluginError;

function complexity(options){
	options = options || {
		cyclomatic: [3, 7, 12],
		halstead: [8, 13, 20],
		maintainability: 100
	};

	var files = [];

	return through.obj(function(file, enc, cb){
		if(file.isNull()){
			return cb(null, file);
		}

		if(file.isStream()){
			return cb(new PluginError('gulp-complexity', 'Streaming not supported'));
		}

		files.push(file);
		cb(null, file);
	}, function(cb){
		var path = require('path'),
			helpers = require('./reporter-helpers');

		maxLength = helpers.longestString(files.map(function(file){
			return path.relative(file.cwd, file.path);
		}));

		files.forEach(function(file){
			var base = path.relative(file.cwd, file.path);
			var report = cr.run(file.contents.toString(), options);

			reporter.log(file, report, options, helpers.fitWhitespace(maxLength, base));
		})

		cb();
	});
}

module.exports = complexity;