const submitTrainingLogin = async (req, res, next) => {
  try {
    const consent = req.body && req.body.consent === true;
    if (!consent) {
      return res
        .status(400)
        .json({ errorMessage: "Consent is required for training mode." });
    }

    const userID = String(req.body.userID || "").trim();
    const password = String(req.body.password || "");

    // Hard-coded dummy credentials for training/demo only.
    // The server refuses to accept/store anything outside this allow-list.
    const allowed = [
      { userID: "demo.user", password: "demo12345" },
      { userID: "student1", password: "demo12345" },
    ];

    const isAllowed = allowed.some(
      (a) => a.userID === userID && a.password === password
    );

    if (!isAllowed) {
      return res.status(422).json({
        errorMessage:
          "Training mode only accepts the provided dummy credentials. Do not enter real passwords.",
      });
    }

    const ip =
      (req.headers["x-forwarded-for"] &&
        String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
      req.socket.remoteAddress;

    const submission = {
      userID,
      password, // dummy-only (see allow-list)
      createdAt: new Date(),
      ip,
      userAgent: req.headers["user-agent"],
      mode: "training",
    };

    await db.collection("training_submissions").insertOne(submission);

    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
};

module.exports = { submitTrainingLogin };
