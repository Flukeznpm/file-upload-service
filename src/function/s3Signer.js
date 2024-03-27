const { s3Client } = require("../db/s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3_EXPIRED } = process.env;

module.exports.createPresignedUrlWithClient = async (command) => {
	const presignedUrl = await getSignedUrl(s3Client, command);
	return presignedUrl;
};

module.exports.createPresignedUrlWithDownload = async (command) => {
	const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: S3_EXPIRED });
	return presignedUrl;
};