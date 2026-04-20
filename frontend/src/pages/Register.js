import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Box from "../components/Box/Box";
import "./Register.scss";
import validator from "validator";
import { Link } from "react-router-dom";
import axios from "axios";
import StrengthMeter from "../components/StrengthMeter/StrengthMeter";
import zxcvbn from "zxcvbn";


const Register = () => {
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [emailErrors, setEmailErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [allValid, setAllValid] = useState(false);

  const validateUsername = async () => {
    const errors = [];
    const u = (username || "").trim().toLowerCase();

    if (!u) {
      errors.push("Username is required.");
      return errors;
    }

    if (!validator.isAlphanumeric(u, "en-US", { ignore: "._" })) {
      errors.push(
        "Usernames can only use letters, numbers, underscores and periods."
      );
    }
    if (!validator.isLength(u, { min: 3, max: 15 })) {
      errors.push("Usernames must be between 3-15 characters.");
    }

    // Only hit the API if basic validation passes.
    if (errors.length) return errors;
    if (!process.env.REACT_APP_API_URL) {
      errors.push("API URL is not configured. Restart the frontend after setting frontend/.env.");
      return errors;
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/exists", {
        username: u,
      });
      if (response.data.exists) {
        errors.push(
          <>
            Username already registered. <Link to="/login">Log in?</Link>
          </>
        );
      }
    } catch (e) {
      errors.push("Could not reach the server to validate username. Is the backend running?");
    }

    return errors;
  };

  const validateEmail = async () => {
    const errors = [];
    const normalizedEmail = validator.normalizeEmail(email);

    if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
      errors.push("Please enter a valid email.");
      return errors;
    }

    if (!process.env.REACT_APP_API_URL) {
      errors.push("API URL is not configured. Restart the frontend after setting frontend/.env.");
      return errors;
    }

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/exists", {
        email: normalizedEmail,
      });
      if (response.data.exists) {
        errors.push(
          <>
            Email already registered. <Link to="/login">Log in?</Link>
          </>
        );
      }
    } catch (e) {
      errors.push("Could not reach the server to validate email. Is the backend running?");
    }

    return errors;
  };

  const validatePassword = () => {
    const errors = [];
    if (!validator.isLength(password, { min: 8, max: undefined })) {
      errors.push("Passwords must be at least 8 characters.");
    }
    return errors;
  };

  const validateConfirmPassword = () => {
    const errors = [];
    if (confirmPassword !== password) {
      errors.push("Passwords do not match.");
    }
    return errors;
  };

  const history = useHistory()

  useEffect(() => {
    const validate = async () => {
      try {
        const uErrors = await validateUsername();
        const eErrors = await validateEmail();
        const pErrors = validatePassword();
        const cErrors = validateConfirmPassword();

        setUsernameErrors(uErrors);
        setEmailErrors(eErrors);
        setPasswordErrors(pErrors);
        setConfirmPasswordErrors(cErrors);

        if (uErrors.length || eErrors.length || pErrors.length || cErrors.length) {
          setAllValid(false);
        } else {
          setAllValid(true);
        }
      } catch (e) {
        setAllValid(false);
      }
    };

    validate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, email, password, confirmPassword]);

  useEffect(() => {
    setConfirmPasswordErrors(validateConfirmPassword());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword]);

  return (
    <div className="FormPage">
      <Box className="form">
        <h1>Instagram</h1>
        <h2>Sign up to see photos and videos from your friends.</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const usernameErrors = await validateUsername();
            const emailErrors = await validateEmail();
            const passwordErrors = validatePassword();
            const confirmPasswordErrors = validateConfirmPassword();
            setUsernameErrors(usernameErrors);
            setEmailErrors(emailErrors);
            setPasswordErrors(passwordErrors);
            setConfirmPasswordErrors(confirmPasswordErrors);

            if (
              usernameErrors.length ||
              emailErrors.length ||
              passwordErrors.length ||
              confirmPasswordErrors.length
            ) {
              console.log("check failed");
            } else {
              axios
                .post(process.env.REACT_APP_API_URL + "/register", {
                  username,
                  password,
                  email,
                })
                .then((response) => {
                  localStorage.setItem("token", response.data.token)
                  localStorage.setItem("username", response.data.username)
                  history.push("/")
                });
            }
          }}
        >
          <label for="username">Username</label>
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onBlur={async () => {
              console.log("usernameErrors", usernameErrors);
              setUsernameErrors(await validateUsername());
            }}
            name="username"
            placeholder="Username"
            type="text"
          />
          {usernameErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <label for="email">Email</label>
          <input
            novalidate
            onBlur={async () => {
              setEmailErrors(await validateEmail());
            }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email"
            placeholder="Email"
            type="email"
          />
          {emailErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <label for="password">Password</label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onBlur={(e) => {
              setPasswordErrors(validatePassword());
            }}
            name="password"
            placeholder="Password"
            type="password"
          />
          {password ? (
            <StrengthMeter strength={zxcvbn(password).score} />
          ) : null}

          {passwordErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          <label for="confirm-password">Confirm password</label>
          <input
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            name="confirm-password"
            placeholder="Confirm password"
            type="password"
          />
          {confirmPasswordErrors.map((error) => {
            return <p className="validation-error">{error}</p>;
          })}
          {formError ? <p className="validation-error">{formError}</p> : null}
          <button disabled={!allValid || isSubmitting} type="submit">
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
          <p className="warning">This website is is not maintained or updated and therefore may not be up to current security standards. <b>Do not enter sensitive information here.</b></p>

        </form>
      </Box>{" "}
      <Box className="other-box">
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </Box>
      <Box className="other-box">
        <p>
          Continue as a <Link to="/explore">guest</Link>
        </p>
      </Box>
    </div>
  );
};

export default Register;
