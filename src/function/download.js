const s3 = require('./s3Bucket');
const uploadLogFunc = require('../function/uploadLog');
const { S3_EXPIRED } = process.env;

module.exports.download = async ({
	userId,
	uploadLogId,
}) => {
	try {
		const { s3FileName } = await uploadLogFunc.getLogByUploadLogId({ uploadLogId });
		if (!s3FileName) { return; }
		await uploadLogFunc.updateDocument({ id: uploadLogId, dataUpdate: { downloadAt: new Date().getTime() } });
		const presignedUrl = await s3.s3Download({ userId, s3FileName });
		const response = {
			presignedUrl: presignedUrl,
			message: `You have ${S3_EXPIRED} seconds to download file.`
		}
		return { response };
	} catch (err) {
		return ({ message: "No such file name in bucket" });
	}
};
