const regex = {
	REGEX_TITLE: /^[a-zA-Z0-9][a-zA-Z0-9 _-]{1,48}[a-zA-Z0-9]$/,
	REGEX_DESCRIPTION: /^[a-zA-ZÀ-ÿ0-9 ,.!?'"()@#$%^&*-_+=:;]{10,1000}$/,
	REGEX_NOM: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ '-]{0,28}[a-zA-ZÀ-ÿ]$/,
	REGEX_EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	REGEX_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
	REGEX_MATRICULE: /^[a-zA-Z0-9]{5,10}$/,
	REGEX_OTP: /^[0-9]{5}$/
};

export default regex;