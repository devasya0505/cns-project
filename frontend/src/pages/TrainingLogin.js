import React, { useMemo, useState } from "react";
import axios from "axios";
import Box from "../components/Box/Box";
import "./Login.scss";

const TrainingLogin = () => {
  const [userID, setUserID] = useState("demo.user");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;

  const dummyAccounts = useMemo(
    () => [
      { userID: "demo.user", password: "demo12345" },
      { userID: "student1", password: "demo12345" },
    ],
    []
  );

  const selected = dummyAccounts.find((a) => a.userID === userID);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!apiUrl) {
      setError("API URL is not configured. Set frontend/.env and restart frontend.");
      return;
    }

    if (!consent) {
      setError("You must confirm consent to use training mode.");
      return;
    }

    try {
      await axios.post(apiUrl + "/training/submit", {
        userID,
        password,
        consent: true,
      });
      setStatus(
        "Submitted. Check MongoDB collection 'training_submissions'. (Dummy credentials only.)"
      );
    } catch (err) {
      setError(
        (err.response && err.response.data && err.response.data.errorMessage) ||
          "Submission failed."
      );
    }
  };

  return (
    <div className="FormPage">
      <Box className="form">
        <h1>Training Login (Demo)</h1>
        <p className="warning">
          This page is for a controlled security training demo. It only accepts a fixed
          list of dummy credentials and will reject everything else. Do not enter any
          real passwords.
        </p>

        <form onSubmit={submit}>
          <label htmlFor="training-user">Dummy account</label>
          <select
            id="training-user"
            value={userID}
            onChange={(e) => {
              setUserID(e.target.value);
              setPassword("");
            }}
          >
            {dummyAccounts.map((a) => (
              <option key={a.userID} value={a.userID}>
                {a.userID}
              </option>
            ))}
          </select>

          <p>
            Dummy password for this account: <b>{selected ? selected.password : ""}</b>
          </p>

          <label htmlFor="training-pass">Enter dummy password</label>
          <input
            id="training-pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type the dummy password above"
            type="password"
            autoComplete="off"
          />

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I understand this is a demo and I will not enter real credentials.
          </label>

          {error ? <p className="validation-error">{error}</p> : null}
          {status ? <p>{status}</p> : null}

          <button type="submit">Submit training login</button>
        </form>
      </Box>
    </div>
  );
};

export default TrainingLogin;
