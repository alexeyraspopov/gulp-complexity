/* jshint node:true */
exports.fitWhitespace = function(maxLength, string){
	// Prevent negative values from breaking the array
	var remaining = Math.max(0, maxLength - string.length);

	return string + Array(remaining + 3).join(' ');
};

exports.longestString = function(strings){
	return strings.reduce(function(maxLength, string){
		return Math.max(maxLength, string.length);
	}, 0);
};

exports.generateBar = function(score, threshold){
	var chalk = require('chalk'),

		// 17.1 for 1/10 of 171, the maximum score
		magnitude = Math.floor(score / 17.1),
		bar = Array(magnitude).join('\u2588') + ' ' + score.toPrecision(5),

		// Out of 171 points, what % did it earn?
		rating = score / threshold;

	return rating < 1 ? chalk.red(bar) : rating < 1.2 ? chalk.yellow(bar) : chalk.green(bar);
};