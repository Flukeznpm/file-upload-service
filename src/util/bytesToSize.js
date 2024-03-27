module.exports.bytesToSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";

	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	if (i == 0) return bytes + ' ' + sizes[i];

	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};