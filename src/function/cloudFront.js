const { CreateInvalidationCommand } = require("@aws-sdk/client-cloudfront");
const { cloudfront } = require("../db/cloudFront");
const { CLOUDFRONT_DISTRIBUTION_ID } = process.env;

module.exports.cloudFrontInvalidation = async ({ key }) => {
	const cfCommand = new CreateInvalidationCommand({
		DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
		InvalidationBatch: {
			CallerReference: key,
			Paths: {
				Quantity: 1,
				Items: [
					"/" + key
				]
			}
		}
	})

	const response = await cloudfront.send(cfCommand);
	return response;
}