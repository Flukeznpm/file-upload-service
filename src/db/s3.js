const { S3Client } = require("@aws-sdk/client-s3");
const { S3_REGION } = process.env;

const s3Client = new S3Client({ region: S3_REGION });

module.exports = { s3Client };