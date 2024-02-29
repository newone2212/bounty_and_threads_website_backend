let otpGenerator = require('otp-generator');
exports.generateOtp = (length) => {
  return otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
}




