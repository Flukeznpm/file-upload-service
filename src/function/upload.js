const { cloudFrontInvalidation } = require("./cloudFront");
const { s3Upload, s3Delete } = require("./s3Bucket");
const { s3MultipartUpload } = require("./s3MultipartUpload");
const uploadLogFunc = require("./uploadLog");
const notificationFunc = require("./notification");
const userFunc = require("./user");
const { isObjectEmpty } = require("../util/checkObj");

module.exports.uploadManagement = async ({
	userId,
	file,
}) => {
	const { originalname, mimetype, buffer, size } = file;
	const uploadLog = await this.upload({
		userId,
		originalname,
		mimetype,
		buffer,
		size,
		action: "upload"
	});

	if (isObjectEmpty(uploadLog) === false) {
		const { emailOriginal } = await userFunc.getUserById({ id: userId })
		notificationFunc.notificationManagement({
			receivers: emailOriginal,
			data: uploadLog,
		});
	}

	return uploadLog;
};

module.exports.deleteManagement = async ({
	userId,
	uploadLogId,
}) => {
	const uploadLogDetail = await uploadLogFunc.getLogByUploadLogId({ uploadLogId });
	if (!uploadLogDetail.s3FileName) { return { message: "Upload log not found." } }
	const promises = [];
	promises.push(s3Delete({ userId, s3FileName: uploadLogDetail.s3FileName }));
	promises.push(uploadLogFunc.updateDocument({ id: uploadLogId, dataUpdate: { isDelete: true, deletedBy: userId } }));
	const [_, updatedLog] = await Promise.all(promises);
	await cloudFrontInvalidation({ key: userId + "/" + uploadLogDetail.s3FileName });
	return { isDelete: updatedLog.isDelete };
};

module.exports.logManagement = async ({
	action,
	userId,
	originalName,
	mimetype,
	size,
	uploadResult,
}) => {
	const mimeType = mimetype;
	const uploadLogCreated = await uploadLogFunc.createUploadLog({
		originalName,
		mimeType,
		size,
		s3FileName: uploadResult.s3FileName,
		s3Url: uploadResult.s3Url,
		action,
		createdBy: userId,
	});

	return {
		uploadLog: uploadLogCreated,
	};
};

module.exports.upload = async ({
	userId,
	originalname,
	mimetype,
	buffer,
	size,
	action
}) => {
	let uploadResult;
	const originalName = originalname;

	if (buffer.length < 100000000) { // < 100 MB
		uploadResult = await s3Upload({
			userId,
			originalName,
			buffer,
		});
	} else {
		uploadResult = await s3MultipartUpload({
			userId,
			originalName,
			buffer,
		});
	}

	const { uploadLog } = await this.logManagement({
		action,
		userId,
		originalName,
		mimetype,
		size,
		uploadResult,
	});

	return uploadLog;
};