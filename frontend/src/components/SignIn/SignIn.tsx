import { TextInput, Button, Box, Anchor, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

import classes from "./SignIn.module.css";

interface Props {
  onSubmit: (values: { email: string; password: string }) => void;
  invalidPassword: boolean;
}

export const SignIn = ({ onSubmit, invalidPassword }: Props) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    // validate: {
    //   email: (value) =>
    //     /^\S+@\S+$/.test(value) ? null : "無効なメールアドレスです",
    //   password: (value) =>
    //     value.length < 5 ? "パスワードは6文字以上入力してください" : null,
    //   name: (value) => (value.length < 1 ? "名前を入力してください" : null),
    // },
  });
  return (
    <Box maw={340} mx="auto">
      <form className={classes.form} onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          withAsterisk
          label="メールアドレス"
          placeholder="メールアドレス"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />

        <TextInput
          withAsterisk
          label="パスワード"
          placeholder="パスワード"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />

        {invalidPassword && <Text c="red">パスワード又はメールアドレスが違います</Text>}

        <Button type="submit">サインイン</Button>

        <Anchor href="/signup" underline="always">
          アカウントの新規作成
        </Anchor>
      </form>
    </Box>
  );
};
