import { TextInput, Button, Box, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./SignUp.module.css";

interface Props {
  onSubmit: (values: { name: string; email: string; password: string }) => void;
}

export const SignUp = ({ onSubmit }: Props) => {
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
          label="ユーザ名"
          placeholder="ユーザ名"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

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

        <Button type="submit">サインアップ</Button>

        <Anchor href="/signin" underline="always">
          サインイン
        </Anchor>
      </form>
    </Box>
  );
};
