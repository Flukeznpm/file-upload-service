const {
	CompleteMultipartUploadCommand,
	UploadPartCommand,
	CreateMultipartUploadCommand,
	AbortMultipartUploadCommand
} = require('@aws-sdk/client-s3');
const { s3Client } = require('../db/s3');
const { fileNameFormat } = require('../util/s3FileNameFormat');
const {
	S3_BUCKET_NAME,
	CLOUDFRONT_DOMAIN
} = process.env;

module.exports.s3MultipartUpload = async ({
	userId,
	originalName,
	buffer,
}) => {
	const { fileNameNew } = await fileNameFormat({ originalName })
	const key = `${userId}/${fileNameNew}`;
	let uploadIdCheck;

	try {
		const multipartParams = {
			Bucket: S3_BUCKET_NAME,
			Key: key,
		}
		const multipartUpload = await s3Client.send(new CreateMultipartUploadCommand(multipartParams));
		const uploadId = multipartUpload.UploadId;
		uploadIdCheck = uploadId; // for catch(err)
		const partSize = Math.ceil(buffer.length / 5); // Multipart uploads require a minimum size of 5 MB per part.
		const uploadPromises = [];

		for (let i = 0; i < 5; i++) {
			const start = i * partSize;
			const end = start + partSize;
			const uploadPart = {
				Bucket: S3_BUCKET_NAME,
				Key: key,
				UploadId: uploadId,
				Body: buffer.subarray(start, end),
				PartNumber: i + 1,
			}
			uploadPromises.push(
				s3Client
					.send(
						new UploadPartCommand(uploadPart)
					)
					.then((d) => {
						return d;
					})
			);
		}

		const uploadResults = await Promise.all(uploadPromises);
		const completeMultipartUpload = await s3Client.send(
			new CompleteMultipartUploadCommand({
				Bucket: S3_BUCKET_NAME,
				Key: key,
				UploadId: uploadId,
				MultipartUpload: {
					Parts: uploadResults.map(({ ETag }, i) => ({
						ETag,
						PartNumber: i + 1,
					})),
				},
			})
		);

		if (completeMultipartUpload.ETag) {
			const s3Url = `${CLOUDFRONT_DOMAIN}/${key}`;
			return { s3FileName: fileNameNew, s3Url: s3Url };
		}
	} catch (err) {
		if (uploadIdCheck) {
			const abortCommand = new AbortMultipartUploadCommand({
				Bucket: S3_BUCKET_NAME,
				Key: key,
				UploadId: uploadIdCheck,
			});
			await s3Client.send(abortCommand);
		}
		throw err;
	}
};