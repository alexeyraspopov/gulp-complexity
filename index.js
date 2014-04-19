/* jshint node:true */
var cr = require('complexity-report'),
	through = require('through2'),
	gutil = require('gulp-util'),
	extend = require('util-extend'),
	reporter = require('./reporter'),
	PluginError = gutil.PluginError;

function complexity(options){
	options = extend({
		cyclomatic: [3, 7, 12],
		halstead: [8, 13, 20],
		maintainability: 100,
		breakOnErrors: true 
	}, options);

	var files = [];
	var errorCount = 0;

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

		var maxLength = helpers.longestString(files.map(function(file){
			return path.relative(file.cwd, file.path);
		}));

		files.forEach(function(file){
			var base = path.relative(file.cwd, file.path);
			var report = cr.run(file.contents.toString(), options);

			if (options.breakOnErrors) {
				var complicatedFunctions = report.functions.filter(isFunctionComplicated);
				errorCount += complicatedFunctions.length;

				if (report.maintability < options.maintainability) {
					errorCount += 1;
				}
			}

			reporter.log(file, report, options, helpers.fitWhitespace(maxLength, base));
		});

		if(options.breakOnErrors && errorCount > 0) {
			this.emit('error', new PluginError('gulp-complexity', 'Complexity too high'));
		}

		cb();
	});

	function isFunctionComplicated(fnInfo) {
		return fnInfo.complexity.cyclomatic > options.cyclomatic[0] ||
			fnInfo.complexity.halstead.difficulty > options.halstead[0];
	}
}

module.exports = complexity;

