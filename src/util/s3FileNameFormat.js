const { v4: uuidv4 } = require('uuid');

module.exports.fileNameFormat = async ({ originalName }) => {
	const fileExtension = originalName?.split(".")[originalName?.split(".").length - 1];
	const fileName = originalName?.slice(0, originalName.length - (fileExtension.length + 1));
	const uuid = this.uuidGenerate();
	const fileNameNew = `${fileName}-${new Date().getTime()}-${uuid}.${fileExtension}`;
	return { fileExtension, fileName, fileNameNew };
};

module.exports.uuidGenerate = () => {
	return uuidv4();
};