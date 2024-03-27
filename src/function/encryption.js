const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ACCESS_TOKEN_SECRET } = process.env;

module.exports.jwtSignToken = async ({ userId }) => {
	const token = jwt.sign(
		{ userId },
		ACCESS_TOKEN_SECRET,
		// { expiresIn: "7d" },
	);
	return token;
};

module.exports.jwtCompare = async ({ data1, data2 }) => {
	const compare = bcrypt.compare(data1, data2);
	return compare;
};

module.exports.jwtVerify = async ({ token }) => {
	const verify = jwt.verify(token, ACCESS_TOKEN_SECRET);
	return verify;
};

module.exports.bcryptData = async (data) => {
	const bcryptData = await bcrypt.hash(data, 10);
	return bcryptData;
};