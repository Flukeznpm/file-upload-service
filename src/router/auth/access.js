const express = require("express");
const router = express();
const userFunc = require("../../function/user");

router.post("/login", async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).send({ message: "Email or Password is required." });
		}
		const login = await userFunc.userLogin({ email, password });
		res.status(login.statusCode).send(login);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
