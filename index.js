var map = require('map-stream'),
	PluginError = require('gulp-util').PluginError;

module.exports = function(options){
	return map(function(file, cb){
		if(file.isNull()){
			return cb(null, file);
		}

		if(file.isStream()){
			return cb(new PluginError('gulp-complexity', 'Streaming not supported'));
		}



		cb(null, file);
	});
};