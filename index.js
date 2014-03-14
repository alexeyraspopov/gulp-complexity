var map = require('map-stream'),
	PluginError = require('gulp-util').PluginError;

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

		cb(null, file);
	});
}

module.exports = complexity;