const s3Bucket = require("../function/s3Bucket");
const s3Signer = require("../function/s3Signer");
const s3FileNameFormat = require("../util/s3FileNameFormat");
const { s3Upload } = require("../function/s3Bucket");
const { fileNameFormat } = require("../util/s3FileNameFormat");
const { CLOUDFRONT_DOMAIN } = process.env;

describe("File name format using in Amazon S3", () => {
	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file.pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file");
	})

	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file.file.file.pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file.file.file");
	})


	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file..file.pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file..file");
	})


	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file.file..pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file.file.");
	})

	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file._/..pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file._/.");
	})

	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file.........pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file........");
	})

	test("Should return correct file name format S3 structure", async () => {
		const args = {
			originalName: "file-file-.pdf.pdf"
		}

		const { fileExtension, fileName } = await fileNameFormat(args);

		expect(fileExtension).toBe("pdf");
		expect(fileName).toBe("file-file-.pdf");
	})
});

describe("File upload to Amazon S3", () => {
	const mockS3 = {
		PutObjectCommand: jest.fn().mockReturnThis(),
		catch: jest.fn(),
	}

	jest.mock("@aws-sdk/client-s3", () => ({ s3: jest.fn(() => mockS3) }));

	test("Should return S3 url correct", async () => {
		const spyS3Signer = jest.spyOn(s3Signer, 'createPresignedUrlWithClient').mockResolvedValue("");
		const spyS3Bucket = jest.spyOn(s3Bucket, 'putObject').mockResolvedValue("");
		const spyS3FileNameFormat = jest.spyOn(s3FileNameFormat, 'fileNameFormat').mockResolvedValue({ fileNameNew: "file001-1640970000000-00000000-0000-0000-0000-000000000000.pdf" });
		const args = {
			userId: "user001",
			originalName: "file001.pdf",
			buffer: "",
		}
		const result = await s3Upload(args);

		expect(spyS3Signer).toHaveBeenCalled();
		expect(spyS3Bucket).toHaveBeenCalled();
		expect(spyS3FileNameFormat).toHaveBeenCalled()
		expect(result.s3FileName).toBe("file001-1640970000000-00000000-0000-0000-0000-000000000000.pdf");
		expect(result.s3Url).toBe(`${CLOUDFRONT_DOMAIN}/user001/file001-1640970000000-00000000-0000-0000-0000-000000000000.pdf`);
	})
});