const { firestore } = require("../db/firestore");

module.exports.createUser = async ({ email, password, emailOriginal }) => {
	const insertData = {
		emailOriginal: emailOriginal,
		email: email,
		password: password,
		isActive: true,
		isDelete: false
	}
	const userPath = firestore.collection("user");
	const { id } = await userPath.add(insertData);
	const userInsertData = await userPath.doc(id).get();
	const userInsertDataFinal = userInsertData.data();
	userInsertDataFinal.id = id;
	return userInsertDataFinal;
};

module.exports.getUserByEmail = async ({ email }) => {
	const userPath = firestore.collection('user');
	const userData = await userPath
		.where('email', '==', email)
		.where('isDelete', '==', false)
		.get();
	if (userData.empty) {
		return null;
	}
	const userDataList = [];
	userData.forEach(doc => {
		userDataList.push({
			id: doc.id,
			...doc.data()
		});
	});
	return userDataList[0];
};