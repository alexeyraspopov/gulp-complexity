/* jshint node:true */
var cr = require('complexity-report'),
	map = require('map-stream'),
	gutil = require('gulp-util'),
	chalk = require('chalk'),
	multiline = require('multiline'),
	PluginError = gutil.PluginError;

function log(file, report, options){
	var template = require('underscore').template;

	var reportTemplate = multiline(function(){/*
<%= chalk.styles.yellow.open %><%= path %>:<%= line %> - <%= name %> is too complicated<%= chalk.styles.yellow.close %>
    Cyclomatic: <%= complexity.cyclomatic %>
    Halstead: <%= complexity.halstead.difficulty %>
      | Effort: <%= complexity.halstead.effort %>
      | Volume: <%= complexity.halstead.volume %>
      | Vocabulary: <%= complexity.halstead.vocabulary %>
	*/});

	var reportFn = template(reportTemplate);

	report.functions.filter(function(fn){
		var cyclomatic = fn.complexity.cyclomatic,
			halstead = fn.complexity.halstead;

		return cyclomatic > options.cyclomatic[0] || halstead.difficulty > options.halstead[0];
	}).map(function(fn){
		return {
			path: require('path').relative(file.cwd, file.path),
			line: fn.line,
			name: fn.name,
			complexity: fn.complexity,
			chalk: chalk
		};
	}).forEach(function(report){
		console.log(reportFn(report));
	});
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

		log(file, report, options);

		cb(null, file);
	});
}

module.exports = complexity;