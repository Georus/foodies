// Handler
exports.handler = async function (event, context) {
  //   console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  //   console.log('## CONTEXT: ' + serialize(context))
  //   console.log('## EVENT: ' + serialize(event))
  try {
    return formatResponse(serialize(event.queryStringParameters));
  } catch (error) {
    return formatError(error);
  }
};

const formatResponse = function (body) {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    isBase64Encoded: false,
    multiValueHeaders: {
      "X-Custom-Header": ["My value", "My other value"],
    },
    body: body,
  };
  return response;
};

const formatError = function (error) {
  const response = {
    statusCode: error.statusCode,
    headers: {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": error.code,
    },
    isBase64Encoded: false,
    body: error.code + ": " + error.message,
  };
  return response;
};

const serialize = function (object) {
  return JSON.stringify(object, null, 2);
};
