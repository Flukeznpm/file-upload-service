const { s3Client } = require('../db/s3');
const {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const s3Signer = require('./s3Signer');
const https = require("https");
const { v4: uuidv4 } = require('uuid');
const {
	S3_BUCKET_NAME,
	CLOUDFRONT_DOMAIN
} = process.env;

module.exports.s3Upload = async ({
	userId,
	originalName,
	buffer,
}) => {
	const fileExtension = originalName?.split(".")[originalName?.split(".").length - 1];
	const fileName = originalName?.slice(0, originalName.length - (fileExtension.length + 1));
	const fileNameNew = `${fileName}-${new Date().getTime()}-${uuidv4()}.${fileExtension}`;
	const key = `${userId}/${fileNameNew}`;
	const params = {
		Bucket: S3_BUCKET_NAME,
		Key: key,
	};

	try {
		const putObjectCommand = new PutObjectCommand(params);
		const presignedUrl = await s3Signer.createPresignedUrlWithClient(putObjectCommand);
		await this.putObject(presignedUrl, buffer);
		const s3Url = `${CLOUDFRONT_DOMAIN}/${key}`;
		const results = { s3FileName: fileNameNew, s3Url: s3Url };
		return results;
	} catch (err) {
		throw err;
	}
};

module.exports.s3Download = async ({ userId, s3FileName }) => {
	var params = {
		Bucket: S3_BUCKET_NAME,
		Key: `${userId}/${s3FileName}`,
	};

	try {
		const getObjectCommand = new GetObjectCommand(params);
		const presignedUrl = await s3Signer.createPresignedUrlWithDownload(getObjectCommand)
		return presignedUrl;
	} catch (err) {
		throw err;
	}
};

module.exports.s3GetObjectBuffer = async ({
	s3FileName,
	s3Folder,
	organizationId,
	serviceId
}) => {
	var params = {
		Bucket: S3_BUCKET_NAME,
		Key: `${organizationId}/${serviceId}/${s3Folder}/${s3FileName}`,
	};

	try {
		const results = await s3Client.send(new GetObjectCommand(params));
		const buffer = await results.Body.transformToByteArray();
		return buffer;
	} catch (err) {
		throw err;
	}
};

module.exports.putObject = async (presignedUrl, buffer) => {
	return new Promise((resolve, reject) => {
		const req = https.request(
			presignedUrl,
			{ method: "PUT", headers: { "Content-Length": buffer.length } },
			(res) => {
				let responseBody = "";
				res.on("data", (chunk) => {
					responseBody += chunk;
				});
				res.on("end", () => {
					resolve(responseBody);
				});
			}
		);
		req.on("error", (err) => {
			reject(err);
		});
		req.write(buffer);
		req.end();
	});
};

module.exports.s3Delete = async ({
	userId,
	s3FileName,
}) => {
	var params = new DeleteObjectCommand({
		Bucket: S3_BUCKET_NAME,
		Key: `${userId}/${s3FileName}`,
	});

	try {
		const response = await s3Client.send(params);
		return response;
	} catch (err) {
		throw err;
	}
};