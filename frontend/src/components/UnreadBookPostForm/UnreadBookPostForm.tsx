/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { MdCurrencyYen } from "react-icons/md";
import { Methods as StatusMethod } from "../../../../types/generated/api/status";

interface Props {
  onSubmit: (values: {
    title: string;
    coverUrl: string;
    status: string;
    price: number;
  }) => void;
}
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const fetcher: Fetcher<StatusMethod["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

export const UnreadBookPostForm = ({ onSubmit }: Props) => {
  const { data } = useSWR(`${apiEndpoint}/status`, fetcher);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      coverUrl: "",
      status: "",
      price: NaN,
    },

    validate: {
      title: (value) => (value.trim().length < 1 ? "入力してください" : null),
      price: (value) => (Number.isNaN(value) ? "入力してください" : null),
    },
  });

  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <TextInput
          withAsterisk
          label="本のタイトル"
          placeholder="本のタイトル"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />

        <TextInput
          label="表紙画像のURL"
          placeholder="表紙画像のURL"
          key={form.key("coverUrl")}
          {...form.getInputProps("coverUrl")}
          mt="md"
        />

        <NumberInput
          rightSection={<MdCurrencyYen />}
          withAsterisk
          label="本の定価"
          placeholder="本の定価"
          key={form.key("price")}
          {...form.getInputProps("price")}
          mt="md"
        />

        <Select
          label="積読の状態"
          placeholder="積読の状態"
          data={data?.map((e) => (e.status ? e.status : ""))}
          mt="md"
          defaultValue="積ん読"
          allowDeselect={false}
          key={form.key("status")}
          {...form.getInputProps("status")}
        />

        <Group justify="center" mt="md">
          <Button type="submit" fullWidth>
            積む
          </Button>
        </Group>
      </form>
    </Box>
  );
};
