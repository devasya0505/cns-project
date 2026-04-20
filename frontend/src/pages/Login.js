import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import "./Login.scss";

const InstagramGlyph = () => (
  <svg
    className="login-page__logo-svg"
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="48"
    height="48"
  >
    <defs>
      <radialGradient id="loginIgLogoGrad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <path
      fill="url(#loginIgLogoGrad)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    className="login-page__fb-icon"
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path
      fill="currentColor"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const MetaWordmark = () => (
  <svg
    className="login-page__meta-icon"
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path
      fill="currentColor"
      d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 9.17 8.15C8.2 7.18 6.84 6.62 5.4 6.62 2.7 6.62 0 9.32 0 12s2.7 5.38 6 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.51 2.83 2.51c.97.97 2.33 1.53 3.77 1.53 3.3 0 6-2.7 6-5.38s-2.7-5.38-6-5.38zm-12.9 8.38c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm12.9 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
    />
  </svg>
);

const Login = () => {
  const history = useHistory();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(process.env.REACT_APP_API_URL + "/login", {
        userID: event.target.userID.value,
        password: event.target.password.value,
      })
      .then((response) => {
        for (const key in response.data) {
          localStorage.setItem(key, response.data[key]);
        }
        history.push("/");
      })
      .catch((err) => {
        if (err.response) {
          setError(
            (err.response.data && err.response.data.errorMessage) ||
              "Could not log in. Try again."
          );
        } else if (err.request) {
          setError(
            "We couldn't reach Instagram. Check your network connection."
          );
        } else {
          setError("Something went wrong!");
        }
      });
  };

  return (
    <div className="login-page">
      <div className="login-page__promo">
        <div className="login-page__promo-inner">
          <div className="login-page__promo-top">
            <InstagramGlyph />
          </div>
          <h1 className="login-page__headline">
            See everyday moments from your{" "}
            <span className="login-page__headline-gradient">
              close friends.
            </span>
          </h1>
          <div className="login-page__stories" aria-hidden="true">
            <div
              className="login-page__story login-page__story--1"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=280&q=80)",
              }}
            />
            <div
              className="login-page__story login-page__story--2"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1517841905240-472988babdf9?w=280&q=80)",
              }}
            />
            <div
              className="login-page__story login-page__story--3"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=280&q=80)",
              }}
            />
            <span className="login-page__story-heart" aria-hidden="true">
              ♥
            </span>
          </div>
        </div>
      </div>

      <div className="login-page__form-panel">
        <div className="login-page__form-wrap">
          <div className="login-page__form-main">
          <h2 className="login-page__title">Log into Instagram</h2>
          <form className="login-page__form" onSubmit={handleSubmit}>
            <label className="login-page__sr-only" htmlFor="login-userID">
              Mobile number, username or email
            </label>
            <input
              id="login-userID"
              name="userID"
              placeholder="Mobile number, username or email"
              type="text"
              autoComplete="username"
            />
            <label className="login-page__sr-only" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
            />
            {error ? <p className="login-page__error">{error}</p> : null}
            <button className="login-page__submit" type="submit">
              Log in
            </button>
          </form>

          <a className="login-page__forgot" href="#forgot">
            Forgot password?
          </a>

          <button className="login-page__fb" type="button">
            <FacebookIcon />
            Log in with Facebook
          </button>

          <Link className="login-page__create" to="/register">
            Create new account
          </Link>

          <Link className="login-page__create" to="/training-login">
            Training demo login (dummy only)
          </Link>

          </div>

          <div className="login-page__meta">
            <MetaWordmark />
            <span>Meta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
