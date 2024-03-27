const express = require("express");
const router = express();
const userFunc = require("../../function/user");

router.post("/user/register", async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).send({ message: "Email or Password is required." });
		}
		const createUser = await userFunc.createUser({ email, password });
		res.status(createUser.statusCode).send(createUser);
	} catch (err) {
		next(err);
	}
});

module.exports = router;