const express = require("express");
const router = express();
const multer = require('multer');
const uploadFunc = require('../../function/upload');
const downloadFunc = require('../../function/download');
const uploadLogFunc = require('../../function/uploadLog');

router.get("/file/download", async (req, res, next) => {
	try {
		const { userId } = req;
		const { uploadLogId } = req.query;
		if (!uploadLogId) { res.status(400).send({ message: "Upload log not found." }) }
		const { response } = await downloadFunc.download({
			userId,
			uploadLogId,
		});
		if (!response) { res.status(200).send({ message: "No such file." }) }
		res.status(200).send(response);
	} catch (err) {
		next(err);
	}
});

router.post("/file/upload", multer().single("file"), async (req, res, next) => {
	try {
		const { userId } = req;
		const file = req.file;
		if (!file) { res.status(400).send({ message: "Please select a file to upload." }) }
		const uploadedResult = await uploadFunc.uploadManagement({ userId, file });
		res.status(201).send({ uploadedResult, message: "Successfully uploaded. " });
	} catch (err) {
		next(err);
	}
});

router.post("/file/library", async (req, res, next) => {
	try {
		const { userId } = req;
		const { page, limit, search, sortBy, timezone } = req.body;
		const uploadLibrary = await uploadLogFunc.libraryUploadLog({
			userId,
			page,
			limit,
			sortBy,
			search,
			timezone
		});
		res.status(200).send(uploadLibrary);
	} catch (err) {
		next(err);
	}
});

router.delete("/file/delete", async (req, res, next) => {
	try {
		const { userId } = req;
		const { uploadLogId } = req.body;
		if (!uploadLogId) { res.status(400).send({ message: "Upload log not found." }) }
		const deletedResult = await uploadFunc.deleteManagement({
			userId,
			uploadLogId,
		});
		res.status(201).send(deletedResult);
	} catch (err) {
		next(err);
	}
});

module.exports = router;