import { Title } from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SignIn } from "../../components/SignIn";
import { useState } from "react";
axios.defaults.withCredentials = true;

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const SignInPage = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <>
      <Title order={2} ta="center" pb={10}>
        サインイン
      </Title>
      <SignIn
        onSubmit={(values) => {
          (async (v: typeof values) => {
            try {
              await axios.post(`${apiEndpoint}/signin`, {
                email: v.email,
                password: v.password,
              });
              navigate("/dashboard");
            } catch (e) {
              if (
                axios.isAxiosError(e) &&
                e.response &&
                e.response.status === 401
              ) {
                setIsError(true);
              }
            }
          })(values);
        }}
        invalidPassword={isError}
      />
    </>
  );
};
