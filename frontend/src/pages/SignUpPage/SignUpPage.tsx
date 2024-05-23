import { Box, Title } from "@mantine/core";
import { SignUp } from "../../components/SignUp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const SignUpPage = () => {
  const navigate = useNavigate();
  return (
    <Box mx="auto" maw={400}>
      <Title order={2} ta="center" pb={10}>
        新規登録
      </Title>
      <SignUp
        onSubmit={(values) => {
          (async (v: typeof values) => {
            await axios.post(`${apiEndpoint}/signup`, {
              email: v.email,
              name: v.name,
              password: v.password,
            });
            navigate("/dashboard");
          })(values);
        }}
      />
    </Box>
  );
};
