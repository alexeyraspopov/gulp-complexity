/* jshint node:true */
var compJs = require('escomplex-js'),
		compCoffee = require('escomplex-coffee'),
		escomplex = require('escomplex');

var _ = require('lodash');

var through = require('through2'),
	gutil = require('gulp-util'),
	reporter = require('./src/reporter'),
	PluginError = gutil.PluginError;

function complexity(options){
	var internalOpts = ['doCoffee', 'doJS'];
	var internalOptions = {};
	internalOpts.forEach(function(o){
		internalOptions[o] = true;
	});

	internalOptions = _.extend(internalOptions, _.pick(options, internalOpts));

	options = _.extend({
		cyclomatic: [3, 7, 12],
		halstead: [8, 13, 20],
		maintainability: 100,
		breakOnErrors: true,
	}, _.omit(options,internalOpts));


	// always making sure threasholds are arrays
	if(!Array.isArray(options.cyclomatic)){
		options.cyclomatic = [options.cyclomatic];
	}

	if(!Array.isArray(options.halstead)){
		options.halstead = [options.halstead];
	}

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
			helpers = require('./src/reporter-helpers');

		var maxLength = helpers.longestString(files.map(function(file){
			return path.relative(file.cwd, file.path);
		}));

		files.filter(function(file){
			return file.contents.toString().length > 0;
		}).forEach(function(file){
			var base = path.relative(file.cwd, file.path);
			var jsReport, coffeeReport, report,
				fileAsString = file.contents.toString();

			if (internalOptions.doCoffee && _.contains(base, '.coffee')) {
        // if we have coffeescript,
        // we will be merning resultsi
        // and recalculating all the values.
        // skipping the calculation here saves on computation
        options.skipCalculation = true;
        report = compCoffee.analyse(fileAsString, options);
      }
      if (_.contains(base, '.js'))
				report = compJs.analyse(fileAsString, options);


			errorCount += report.functions.filter(function(data){
				return (data.cyclomatic > options.cyclomatic[0]) || (data.halstead.difficulty > options.halstead[0]);
			}).length;
			if (report.maintainability < options.maintainability) {
				errorCount++;
			}

			reporter.log(file, report, options, helpers.fitWhitespace(maxLength, base));
		});

		if(options.breakOnErrors && errorCount > 0) {
			this.emit('error', new PluginError('gulp-complexity', 'Complexity too high'));
		}

		cb();
	});
}

module.exports = complexity;
