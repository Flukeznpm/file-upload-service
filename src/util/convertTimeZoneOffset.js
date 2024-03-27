module.exports.convertTimeZoneOffset = (timestamp, gmt = 0) => {
	const timeZone = timestamp + 1000 * 60 * 60 * gmt;
	return new Date(timeZone);
};