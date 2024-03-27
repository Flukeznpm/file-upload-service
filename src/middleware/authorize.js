const encryptionFunc = require("../function/encryption");

module.exports.authorize = async (req, res, next) => {
	if (!req.headers["authorization"]) {
		return res.status(401).send({ message: "Unauthorized" });
	}
	const token = req.headers["authorization"].replace("Bearer ", "");

	try {
		const decoded = await encryptionFunc.jwtVerify({ token });
		req.userId = decoded?.userId || null;
	} catch (err) {
		return res.status(403).send({ message: "Forbidden", err });
	}

	return next();
};