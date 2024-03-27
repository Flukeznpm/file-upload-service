const uploadLogRepo = require("../repository/uploadLog");
const { bytesToSize } = require("../util/bytesToSize");
const { convertTimeZoneOffset } = require("../util/convertTimeZoneOffset");

module.exports.createUploadLog = async ({
	originalName,
	mimeType,
	size,
	s3FileName,
	s3Url,
	action,
	createdBy,
}) => {
	const createUploadLog = await uploadLogRepo.createUploadLog({
		originalName,
		mimeType,
		size,
		s3FileName,
		s3Url,
		action,
		createdBy,
	});
	return createUploadLog;
};

module.exports.updateDocument = async ({ id, dataUpdate }) => {
	const updated = await uploadLogRepo.updateDocument({ id, dataUpdate });
	return updated;
};

module.exports.libraryUploadLog = async ({
	userId,
	page,
	limit,
	sortBy,
	search,
	timezone
}) => {
	let libraryUploadLog = await uploadLogRepo.libraryUploadLog({
		userId,
		page: Number(page),
		limit: Number(limit),
		sortBy: (String(sortBy)).toLowerCase() || "desc",
		search,
	});

	for (let doc of libraryUploadLog.logs) {
		let createAtUTC = convertTimeZoneOffset((new Date(doc.createdAt)).getTime(), timezone);
		let sizeUnit = bytesToSize(Number(doc.size));
		doc.createAtUTC = createAtUTC;
		doc.sizeUnit = sizeUnit;
	}

	return libraryUploadLog;
};

module.exports.getLogByUploadLogId = async ({ uploadLogId }) => {
	const uploadLog = await uploadLogRepo.getLogByUploadLogId({ uploadLogId });
	return uploadLog;
};