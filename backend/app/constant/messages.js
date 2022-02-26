const MESSAGES = {
  AUTH: {
    USER_NOT_FOUND: `User doesn't exists`,
    ACCOUNT_NOT_FOUND: `Account doesn't exists`,
    TYPE_NOT_FOUND: `Type doesn't exists`,
    MULTIPLE_USER_FOUND: `Multiple User found.`,
    INVALID_TOKEN: 'Invalid Token',
    EMAIL_ALREADY_EXISTS:
      'Someone is already added the same email address.',
    USER_REGISTERED: 'Account created successfully.',
    ORGANIZATION_REGISTERED: 'Organization account created successfully.',
    ORGANIZATION_NOT_FOUND: `Organization doesn't exists`,
    MULTIPLE_ORGANIZATION_FOUND: `Multiple Organization found.`,
    INVALID_OLD_PASSWORD: `Old Password is not Correct`,
    INVALID_OTP: `Invalid Verification Code`
  },
  COMMON: {
    INVALID_PARAMETERS: 'Please pass correct parameters.',
    ERROR: 'Something went wrong ',
    DATA_NOT_FOUND: 'Data not found'
  }
};
module.exports = { MESSAGES };
