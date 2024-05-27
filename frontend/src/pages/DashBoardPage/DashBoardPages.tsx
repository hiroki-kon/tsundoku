/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { Methods } from "../../../../types/generated/api/unread-books/amount";
import { Methods as UnreadBookMethods } from "../../../../types/generated/api/unread-books";
import { Methods as TagsMethod } from "../../../../types/generated/api/tags";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Badge,
  Box,
  Card,
  Center,
  Text,
  Grid,
  useMantineTheme,
  Table,
} from "@mantine/core";
import { AreaChart, PieChart } from "@mantine/charts";
import classes from ".//DashBoardPages.module.css";
import { StatsCard } from "../../components/StatsCard";

import dayjs from "dayjs";

const amountFetcher: Fetcher<Methods["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const fetcher: Fetcher<UnreadBookMethods["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const tagsFetcher: Fetcher<TagsMethod["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const DashBoardPages = () => {
  const { data: amount, error: amountError } = useSWR(
    `${apiEndpoint}/unread-books/amount`,
    amountFetcher
  );

  const { data } = useSWR(`${apiEndpoint}/unread-books`, fetcher);

  const { data: tagsData } = useSWR(`${apiEndpoint}/tags`, tagsFetcher);

  const generatePieChartData = (
    sourceData: UnreadBookMethods["get"]["resBody"] | undefined
  ): { name: string; value: number; color: string }[] => {
    if (sourceData === undefined) {
      return [];
    }
    const tags = sourceData?.flatMap((item) => item.tags) as string[];

    type InitialObj = { [k: string]: number };
    const totalling = tags?.reduce((acc, crr) => {
      acc[crr] = (acc[crr] || 0) + 1;
      return acc;
    }, {} as InitialObj);

    const colors = ["teal", "yellow", "pink", "violet", "red"];

    console.log(totalling);
    const test = Object.entries(totalling)
      .map(([key, value], i) => ({
        name: key,
        value: value,
      }))
      .sort((a, b) => (a.value > b.value ? -1 : 1))
      .map((item, i) => ({ ...item, color: colors[i] }));

    console.log(test);
    return test;
  };
  generatePieChartData(data);

  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    if (amountError) {
      if (amountError.response.status === 401) {
        navigate("/signin");
      }
    }
  }, [amountError, navigate]);

  return (
    <Grid
      className={classes.container}
      bg={theme.colors.gray[2]}
      gutter="xl"
      justify="space-between"
      align="stretch"
      grow
    >
      <Grid.Col span={2}>
        <StatsCard
          title="積読の総額"
          text={`¥ ${amount?.totalAmount?.toLocaleString()}`}
        />
      </Grid.Col>

      <Grid.Col span={2}>
        <StatsCard title="持ってる本の数" text={`${data?.length} 冊`} />
      </Grid.Col>
      <Grid.Col span={2}>
        <StatsCard
          title="積んでる本の数"
          text={`${data?.filter((item) => item.status === "積読").length} 冊`}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <StatsCard
          title="消化率"
          text={`${
            data
              ? Math.round(
                  (data!.filter((item) => item.status === "読了").length /
                    data!.length) *
                    1000
                ) / 10
              : undefined
          } %`}
        />
      </Grid.Col>

      <Grid.Col span={2}>
        <StatsCard
          title="積んでる期間の平均"
          text={`${
            data
              ? Math.round(
                  data!.reduce(
                    (acc, crr) =>
                      crr?.status === "積読"
                        ? dayjs(dayjs()).diff(crr.piledUpAt, "day") + acc
                        : acc,
                    0
                  ) / data?.filter((item) => item.status === "積読").length
                )
              : undefined
          } 日`}
        />
      </Grid.Col>

      <Grid.Col span={7}>
        <Card shadow="sm" padding="lg" radius="md">
          <Text c="dimmed" mb={"md"}>
            月別 購入金額
          </Text>
          <AreaChart
            h={300}
            data={amount?.data as Record<string, unknown>[]}
            dataKey="date"
            series={[{ name: "amount", color: "indigo.6" }]}
            curveType="natural"
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={4}>
        <Card>
          <Text c="dimmed" mb={"md"}>
            タグ別
          </Text>
          <PieChart data={generatePieChartData(data)} withTooltip mx="auto" />
          <Text c="dimmed" mb={"xs"}>
            上位2種類
          </Text>
          <Table p={10}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>タグ名</Table.Th>
                <Table.Th>数 (冊)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {generatePieChartData(data)
                .slice(0, 2)
                .map((item) => (
                  <Table.Tr key={item.name}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.value}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
