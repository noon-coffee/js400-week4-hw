module.exports = {};

module.exports.parseToken = (reqHeaderToken) => {
  return reqHeaderToken.startsWith('Bearer ') 
    ? reqHeaderToken.slice(7, reqHeaderToken.length).trimLeft() : reqHeaderToken;
}