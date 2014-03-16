/* jshint node:true */
var multiline, template, reportTemplate, reportFn;

multiline = require('multiline');
template = require('underscore').template;

reportTemplate = multiline(function(){/*
<%= chalk.styles.yellow.open %><%= '\u2717' %> <%= path %>:<%= line %> - <%= name %> is too complicated<%= chalk.styles.yellow.close %>
    Cyclomatic: <%= complexity.cyclomatic %>
    Halstead: <%= complexity.halstead.difficulty %>
      | Effort: <%= complexity.halstead.effort %>
      | Volume: <%= complexity.halstead.volume %>
      | Vocabulary: <%= complexity.halstead.vocabulary %>
*/});

reportFn = template(reportTemplate);

exports.log = function(file, report, options, fittedName){
	var chalk = require('chalk'),
		path = require('path'),
		name = path.relative(file.cwd, file.path),
		helpers = require('./reporter-helpers'),
		valid = true;

	report.functions.filter(function(fn){
		var cyclomatic = fn.complexity.cyclomatic,
			halstead = fn.complexity.halstead;

		return cyclomatic > options.cyclomatic[0] || halstead.difficulty > options.halstead[0];
	}).map(function(fn){
		return {
			path: name,
			line: fn.line,
			name: fn.name,
			complexity: fn.complexity,
			chalk: chalk
		};
	}).forEach(function(report){
		valid = false;
		console.log(reportFn(report));
	});

	if(valid){
		console.log(chalk.green('\u2713'), fittedName, helpers.generateBar(report.maintainability, options.maintainability));
	}
};