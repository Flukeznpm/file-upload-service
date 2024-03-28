const { CloudFrontClient } = require("@aws-sdk/client-cloudfront");
const {
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY
} = process.env;
const cloudfront = new CloudFrontClient({
	region: "REGION",
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	}
});

module.exports = { cloudfront };