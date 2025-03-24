const responseFunction = (statusCode, successBit, message, data) => {
  if (!successBit) return { statusCode, success: successBit, error: message };
  else return { statusCode, success: successBit, message, data };
};

export default responseFunction;
