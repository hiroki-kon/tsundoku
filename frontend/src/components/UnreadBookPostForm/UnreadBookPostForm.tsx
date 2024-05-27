/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TextInput,
  Button,
  Group,
  Box,
  Select,
  NumberInput,
  MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { MdCurrencyYen } from "react-icons/md";
import { DateInput } from "@mantine/dates";
import { Methods as StatusMethod } from "../../../../types/generated/api/status";
import { Methods as TagsMethod } from "../../../../types/generated/api/tags";

import { Dayjs } from "dayjs";
import "dayjs/locale/ja";

interface FormValues {
  title: string;
  coverUrl: string;
  status: string;
  price: number;
  piledUpAt: Date | null;
  tags: string[];
}

interface Props {
  onSubmit: (values: FormValues) => void;
}
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const fetcher: Fetcher<StatusMethod["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const tagsFetcher: Fetcher<TagsMethod["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

export const UnreadBookPostForm = ({ onSubmit }: Props) => {
  const { data } = useSWR(`${apiEndpoint}/status`, fetcher);
  const { data: tagsData } = useSWR(`${apiEndpoint}/tags`, tagsFetcher);


  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      coverUrl: "",
      status: "",
      price: NaN,
      piledUpAt: null,
      tags: [],
    },

    validate: {
      title: (value) => (value.trim().length < 1 ? "入力してください" : null),
      price: (value) => (Number.isNaN(value) ? "入力してください" : null),
      piledUpAt: (value) => (value === null ? "入力してください" : null),
      tags: (value) => (value.length > 3 ? "4個以上選択できません" : null),
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

        <MultiSelect
          label="タグ"
          placeholder="タグ"
          data={
            tagsData?.map((tag) => ({
              value: tag.tagId?.toString(),
              label: tag.tagName,
            })) as { value: string; label: string }[]
          }
          key={form.key("tags")}
          {...form.getInputProps("tags")}
          mt="md"
        />

        <DateInput
          withAsterisk
          label="積み始めた日"
          locale="ja"
          key={form.key("piledUpAt")}
          {...form.getInputProps("piledUpAt")}
          mt="md"
          valueFormat="YYYY年 MM月 DD日"
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
