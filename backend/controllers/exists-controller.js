const validator = require("validator");

const exists = async (req, res, next) => {
  if (req.body.email && req.body.username) {
    res.sendStatus(400);
  } else if (req.body.email) {
    const email = validator.normalizeEmail(req.body.email);
    const result = !!(await db.collection("users").findOne({ email }));
    res.send({ exists: result });
  } else if (req.body.username) {
    const username = String(req.body.username).toLowerCase();
    const result = !!(await db.collection("users").findOne({ username }));
    res.send({ exists: result });
  } else {
    res.sendStatus(400);
  }
};

module.exports = { exists };
