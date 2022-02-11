const isTeacher = (req, res, next) => {
  if (!req.user.isTeacher) return res.status(403).send(`unauthorized`);

  next();
};

module.exports = isTeacher;
