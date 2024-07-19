import otpGenerator from 'otp-generator';

const generateOTP = () => {
    return otpGenerator.generate(5, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
}

export default generateOTP;