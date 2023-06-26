const slugify = require("slugify");

exports.applySlug = (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  next();
};
