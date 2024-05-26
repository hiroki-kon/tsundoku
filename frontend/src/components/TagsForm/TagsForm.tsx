/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Badge,
  Button,
  Flex,
  Grid,
  Group,
  TextInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { Methods as TagsMethods } from "../../../../types/generated/api/tags";
import classes from "./TagsForm.module.css";

const fetcher: Fetcher<TagsMethods["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const TagsForm = () => {
  const { data, mutate } = useSWR(`${apiEndpoint}/tags`, fetcher);
  console.log(data);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      tag: "",
    },

    validate: {
      tag: (value) => (value.length < 1 ? "入力してください" : null),
    },
  });

  return (
    <>
      <Flex mb={"md"} gap="md" wrap="wrap">
        {data?.map((item) => (
          <Badge
            color="blue"
            size="lg"
            radius="md"
            leftSection={
              <IoClose
                className={classes.deletableTag}
                style={{ width: rem(15), height: rem(15) }}
                onClick={async () => {
                  await axios.delete(`${apiEndpoint}/tags/${item.tagId}`);
                  mutate(data?.filter((elem) => elem.tagId !== item.tagId));
                }}
              />
            }
          >
            {item.tagName}
          </Badge>
        ))}
      </Flex>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const result = await axios.post(`${apiEndpoint}/tags`, {
            tagName: values.tag,
          });
          console.log(result.data);

          mutate(data ? [...data, result.data] : [result.data]);
        })}
      >
        <TextInput
          withAsterisk
          label="タグの追加"
          placeholder="タグ名"
          key={form.key("tag")}
          {...form.getInputProps("tag")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">追加</Button>
        </Group>
      </form>
    </>
  );
};
