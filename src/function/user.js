const userRepo = require("../repository/user");
const encryptionFunc = require("./encryption");

let userResponse = {
	statusCode: "",
	isSuccess: "",
	user: "",
	message: ""
};

module.exports.createUser = async ({ email, password }) => {
	const userByEmail = await this.getUserByEmail({ email: email.toLowerCase() });
	if (userByEmail) {
		userResponse = {
			statusCode: 400,
			message: "Email is already exist.",
			isSuccess: false,
			user: null
		}
		return userResponse;
	}

	const encryptedPassword = await encryptionFunc.bcryptData(password);
	const user = await userRepo.createUser({
		emailOriginal: email,
		email: email.toLowerCase(),
		password: encryptedPassword,
	});

	const accessToken = await encryptionFunc.jwtSignToken({ userId: user.id });
	user.accessToken = accessToken;

	userResponse = {
		statusCode: 201,
		message: "Successfully create an user.",
		isSuccess: true,
		user: user
	}

	return userResponse;
};

module.exports.getUserById = async ({ id }) => {
	const user = await userRepo.getUserById({ id: id });
	return user;
};

module.exports.getUserByEmail = async ({ email }) => {
	const userByEmail = await userRepo.getUserByEmail({ email: email.toLowerCase() });
	return userByEmail;
};

module.exports.userLogin = async ({ email, password }) => {
	const user = await this.getUserByEmail({ email: email.toLowerCase() });
	if (!user) {
		userResponse = {
			statusCode: 400,
			message: "Email or Password is invalid.",
			isSuccess: false,
			user: null
		}
		return userResponse;
	}

	const passwordCompare = await encryptionFunc.jwtCompare({ data1: password, data2: user.password });
	if (user && passwordCompare) {
		const accessToken = await encryptionFunc.jwtSignToken({ userId: user.id });
		user.accessToken = accessToken;
		delete user.password;
		userResponse = {
			statusCode: 200,
			message: "Successfully login.",
			isSuccess: true,
			user: { accessToken }
		}
		return userResponse;
	}

	userResponse = {
		statusCode: 400,
		message: "Email or Password is invalid.",
		isSuccess: false,
		user: null
	}

	return userResponse;
};