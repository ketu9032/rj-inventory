const RESPONSE_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized',
  NOT_FOUND: 'not_found',
  BAD_REQUEST: 'bad_request'
};
const STATUS_CODE = {
  SUCCESS: 200,
  ERROR: 500,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  CREATED: 201,
  BAD: 400,
  NO_CONTENT: 204
};

module.exports = { RESPONSE_STATUS, STATUS_CODE };
