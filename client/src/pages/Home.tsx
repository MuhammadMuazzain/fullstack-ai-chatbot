import React, { Fragment, useState, useContext } from "react";
import {
  ErrorIndicator,
  Heading1,
  Margin,
  MarginSmall,
  Paragraph,
  Small,
} from "../shared/layout";
import { Input, Loader } from "../shared/utilities";
import { useNavigate } from "react-router-dom";
import { axios } from "../middleware/axios";
import SessionContext from "../context/session";
import loader from "../assets/loader.svg";
import Button from "../components/Button";
import InlineNotification from "../components/InlineNotification";
import SystemStatus from "../components/SystemStatus";

const Home = () => {
  const { setToken, name, setName, setSessionStart } =
    useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log(name);

  const handleInput = (event: any) => {
    setName(event.target.value);
  };

  const CREATE_SESSION = async () => {
    try {
      setLoading(true);
      const token = await axios.post(`/token?name=${name}`);
      setToken(token?.data.token);
      setName(token?.data.name);
      setSessionStart(token?.data.session_start);
      setLoading(false);
      navigate(`chat/${token.data.token}`);
    } catch (error: any) {
      setLoading(false);
      if (error?.message === "timeout exceeded") {
        setError("An unknown error has occured, Please try again later");
      } else if (error?.response.status === 400) {
        setError("Error! Provide Required Credentials");
      } else {
        setError("An unknown error has occured, Please try again later");
      }
    }
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    if (name.length > 0) {
      CREATE_SESSION();
    } else {
      setError("Error! Provide Required Credentials");
    }
  };

  return (
    <Fragment>
      <Heading1>Sentinel Console</Heading1>
      <MarginSmall />
      <Paragraph style={{ textAlign: "center" }}>
        Internal operations dashboard for security and compliance teams — real-time
        AI-assisted chat, Python backend automations, API integrations, and live
        service monitoring. Built with React, FastAPI, and Redis.
      </Paragraph>
      <SystemStatus />
      <InlineNotification
        kind={"error"}
        children={
          "Internal build — AI responses are generated via external API integration. Do not enter sensitive compliance data."
        }
      />
      <InlineNotification
        kind={"warning"}
        children={
          "Development build — responses are generated via external API and may vary in quality."
        }
      />

      {loading ? (
        <Loader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "137px",
            }}
          >
            <Paragraph> Loading Session</Paragraph>
            <img src={loader} alt="UI loading" />
          </div>
        </Loader>
      ) : (
        <form onSubmit={onSubmit}>
          <Input
            placeholder="Enter your name to start a session"
            value={name}
            type="text"
            onChange={handleInput}
          ></Input>
          <MarginSmall></MarginSmall>

          <Margin />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <Button kind="secondary" text={"Start Session"} hasIcon={true} />
            {error ? <ErrorIndicator>{error}</ErrorIndicator> : ""}
          </div>
        </form>
      )}
      <Margin></Margin>
    </Fragment>
  );
};

export default Home;
