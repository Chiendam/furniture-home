module.exports = (functionParam) => {
  return (req, res, next) => {
    functionParam(req, res, next)
      .then(() =>{
      })
      .catch(next);
  };
};