import { Box, Title } from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SignIn } from "../../components/SignIn";
axios.defaults.withCredentials = true;

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Title order={2} ta="center" pb={10}>
        ログイン
      </Title>
      <SignIn
        onSubmit={(values) => {
          (async (v: typeof values) => {
            await axios.post(`${apiEndpoint}/signin`, {
              email: v.email,
              password: v.password,
            });
            navigate("/dashboard");
          })(values);
        }}
      />
    </>
  );
};
