const checkCookies = (req, res, next) => {
  const { cookies } = req;

  if (cookies.feedback) return res.send(`You have already given a feedback`);

  next();
};

module.exports = checkCookies;
