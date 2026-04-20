const validator = require("validator");

const getUser = async (userID) => {
  const raw = (userID || "").trim();
  const normalizedEmail = raw.includes("@") ? validator.normalizeEmail(raw) : null;
  const lowerUsername = raw.toLowerCase();

  const or = [{ username: raw }, { username: lowerUsername }, { email: raw }];
  if (normalizedEmail) {
    or.push({ email: normalizedEmail });
  }

  const user = await db.collection("users").findOne({ $or: or });
  return user;
};

module.exports = getUser;
