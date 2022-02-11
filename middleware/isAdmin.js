const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin || !req.user.approved)
    return res.status(403).send(`unauthorized`);

  next();
};

module.exports = isAdmin;
