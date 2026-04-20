require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("Provide a MONGODB_URI in .env");
}
if (!process.env.SECRET_KEY) {
  throw new Error("Provide a SECRET_KEY in .env");
}

const fs = require("fs");
require("./util/http-error");
const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const cors = require("cors");
const fileUpload = require("./middleware/file-upload");
const { connectDb } = require("./util/db");

const {
  createPost,
  deletePost,
  getPost,
  explorePosts,
  getPosts,
} = require("./controllers/posts-controller");
const { socketHandler, initWs } = require("./util/socket-handler");
const checkAuth = require("./middleware/check-auth");
const uploadProgress = require("./middleware/upload-progress");
const {
  getComments,
  postComment,
} = require("./controllers/comments-controller");
const { likePost, unlikePost } = require("./controllers/likes-controller");
const { getUser } = require("./controllers/user-controller");
const { followUser, unfollowUser } = require("./controllers/follow-controller");
const { exists } = require("./controllers/exists-controller");
const {
  savePost,
  unSavePost,
  getSavedPosts,
} = require("./controllers/save-controller");
const { login, register } = require("./controllers/auth-controller");
const { submitTrainingLogin } = require("./controllers/training-controller");
const { updateBio, updateProfile } = require("./controllers/edit-controller");
const { search } = require("./controllers/search-controller");

const app = express();


app.use(express.json());

app.use(cors());

// Serve the React production build only when it exists.
const buildPath = path.join(__dirname, "../frontend/build");
const indexPath = path.join(buildPath, "index.html");
if (fs.existsSync(indexPath)) {
  app.use(express.static(buildPath, { dotfiles: "allow" }));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

app.post("/api/register", register);
app.post("/api/login", login);
app.post("/api/training/submit", submitTrainingLogin);
app.post("/api/exists/", exists);
app.use("/api/uploads/images", express.static(path.join("uploads", "images")));
app.get("/api/explore", explorePosts);
app.get("/api/search/:query", search);

app.use(checkAuth);

app.get("/api/users/:username", getUser);
app.get("/api/comments/:id", getComments);
app.post("/api/comments/:id", postComment);

app.post("/api/like/:id", likePost);
app.post("/api/unlike/:id", unlikePost);

app.delete("/api/posts/delete/:id", deletePost);
app.get("/api/posts", getPosts);

app.get("/api/posts/:id", getPost);
app.post("/api/posts", socketHandler, uploadProgress, fileUpload.any(), createPost);

app.post("/api/follow/:id", followUser);
app.post("/api/unfollow/:id", unfollowUser);

app.post("/api/save/:id", savePost);
app.post("/api/unsave/:id", unSavePost);
app.get("/api/saved", getSavedPosts);

app.put("/api/update-bio", updateBio);
app.put("/api/update-profile", fileUpload.single("file"), updateProfile);


app.use((req, res, next) => {
  throw new HttpError("Couldn't find this page.", 404);
});

app.use((error, req, res, next) => {
  console.log(error);
  if (res.headerSent) {
    return next(error);
 }
  res.status(error.code || 500);
  res.json({ errorMessage: error.message || "Unknown error occurred" });
});
const useSsl = process.env.USE_SSL === "true";
const port = process.env.PORT || (useSsl ? 443 : 5000);

function startServer() {
  let server;
  if (useSsl) {
    console.log("using ssl");
    const keyPath = path.join(__dirname, "ssl", "key.pem");
    const certPath = path.join(__dirname, "ssl", "cert.pem");
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      throw new Error(
        "USE_SSL=true but ssl/key.pem or ssl/cert.pem is missing. Set USE_SSL=false for local dev."
      );
    }
    server = https.createServer(
      {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
      app
    );
  } else {
    server = http.createServer(app);
  }

  server.listen(port, () => {
    console.log("Listening on port " + port);
    initWs(server);
  });
}

connectDb()
  .then(startServer)
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });



