const { firestore } = require("../db/firestore");

module.exports.createUploadLog = async ({
	originalName,
	mimeType,
	size,
	s3FileName,
	s3Url,
	action,
	createdBy,
}) => {
	try {
		const { fileExtension, fileName } = await fileNameFormat({ originalName })
		const insertData = {
			fileNameOriginal: fileName || null,
			fileExtension: fileExtension || null,
			mimeType: mimeType || null,
			size: size || null,
			s3Bucket: process.env.S3_BUCKET_NAME || null,
			s3FileName: s3FileName || null,
			s3Url: s3Url || null,
			action: action || "upload",
			isDelete: false,
			createdAt: new Date().getTime(),
			createdBy: createdBy || null
		}
		const uploadLogPath = firestore.collection("uploadLog");
		const { id } = await uploadLogPath.add(insertData);
		const log = await uploadLogPath.doc(id).get();
		const logData = log.data();
		logData.id = id;
		return logData;
	} catch (error) {
		throw error
	}
};

module.exports.updateDocument = async ({ id, dataUpdate }) => {
	try {
		const uploadLogPath = firestore.collection('uploadLog').doc(id);
		await uploadLogPath.update({ ...dataUpdate, updatedAt: new Date().getTime() });
		const log = await uploadLogPath.get();
		const logData = log.data();
		logData.id = id;
		return logData;
	} catch (error) {
		throw error
	}
};

module.exports.libraryUploadLog = async ({
	userId,
	page,
	limit,
	sortBy,
	search,
}) => {
	try {
		let result, totalLog;
		const logsData = [];
		const uploadLogPath = firestore.collection("uploadLog");

		search ?
			await uploadLogPath
				.orderBy('fileNameOriginal', sortBy)
				.where('createdBy', '==', userId)
				.where('isDelete', '==', false)
				.where('fileNameOriginal', '>=', search)
				.where('fileNameOriginal', '<=', search + '\uf8ff')
				.get()
				.then(async (document) => {
					totalLog = document.docs.length;
					if (document.docs.length) {
						let last = document.docs[(page - 1) * limit];
						await uploadLogPath
							.orderBy('fileNameOriginal', sortBy)
							.where('createdBy', '==', userId)
							.where('isDelete', '==', false)
							.where('fileNameOriginal', '>=', search)
							.where('fileNameOriginal', '<=', search + '\uf8ff')
							.startAt(last)
							.limit(limit)
							.get()
							.then((data) => {
								let rowStart = (page - 1) * limit;
								data.forEach((v) => {
									logsData.push({
										id: v.id,
										row: rowStart + 1,
										...v.data(),
									})
									rowStart = rowStart + 1;
								})
							})
					}
				})
			: await uploadLogPath
				.orderBy('createdAt', sortBy)
				.where('createdBy', '==', userId)
				.where('isDelete', '==', false)
				.get()
				.then(async (document) => {
					totalLog = document.docs.length;
					if (document.docs.length) {
						let last = document.docs[(page - 1) * limit];
						await uploadLogPath
							.orderBy('createdAt', sortBy)
							.where('createdBy', '==', userId)
							.where('isDelete', '==', false)
							.startAt(last)
							.limit(limit)
							.get()
							.then((data) => {
								let rowStart = (page - 1) * limit;
								data.forEach((v) => {
									logsData.push({
										id: v.id,
										row: rowStart + 1,
										...v.data(),
									})
									rowStart = rowStart + 1;
								})
							})
					}
				});

		if (!logsData.length) {
			return {
				totalLog: 0,
				totalPage: 0,
				logs: []
			}
		}

		const totalPage = Math.ceil(totalLog / limit);

		result = {
			totalLog: totalLog,
			totalPage: totalPage,
			logs: logsData
		}

		return result;
	} catch (error) {
		throw error
	}
};

module.exports.getLogByUploadLogId = async ({ uploadLogId }) => {
	const uploadLogPath = firestore.collection("uploadLog");
	const log = await uploadLogPath.doc(uploadLogId).get();
	const uploadLog = log.data();
	if (!uploadLog) {
		return { s3FileName: null }
	} else if (uploadLog.isDelete === true) {
		return { s3FileName: null }
	} else {
		return {
			...uploadLog,
		}
	}
};