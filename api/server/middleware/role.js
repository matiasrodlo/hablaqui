const role = (property) => {
  return (req, res, next) => {
    if (!property.includes(req.user.role)) {
      res.status(403).json({ errors: "You shall not pass." });
    } else {
      next();
    }
  };
};
export default role;
