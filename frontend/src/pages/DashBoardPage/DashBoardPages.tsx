/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { Methods } from "../../../../types/generated/api/unread-books/amount";
import { Methods as UnreadBookMethods } from "../../../../types/generated/api/unread-books";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Badge,
  Box,
  Card,
  Center,
  Flex,
  Grid,
  useMantineTheme,
} from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import classes from ".//DashBoardPages.module.css";
import { StatsCard } from "../../components/StatsCard";
import { data } from "./data";

import dayjs from "dayjs";

const amountFetcher: Fetcher<Methods["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const fetcher: Fetcher<UnreadBookMethods["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const DashBoardPages = () => {
  const { data: amount, error: amountError } = useSWR(
    `${apiEndpoint}/unread-books/amount`,
    amountFetcher
  );

  const { data } = useSWR(`${apiEndpoint}/unread-books`, fetcher);

  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    if (amountError) {
      if (amountError.response.status === 401) {
        navigate("/signin");
      }
    }
  }, [amountError, navigate]);

  console.log(amount);
  console.log(data);

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
              ? data!.reduce(
                  (acc, crr) =>
                    crr?.status === "積読"
                      ? dayjs(dayjs()).diff(crr.piledUpAt, "day") + acc
                      : acc,
                  0
                ) / data?.filter((item) => item.status === "積読").length
              : undefined
          }`}
        />
      </Grid.Col>

      {/* <Grid.Col span={7}>
        <Card shadow="sm" padding="lg" radius="md">
          <AreaChart
            h={300}
            data={data}
            dataKey="date"
            series={[
              { name: "Apples", color: "indigo.6" },
              { name: "Oranges", color: "blue.6" },
              { name: "Tomatoes", color: "teal.6" },
            ]}
            curveType="natural"
          />
        </Card>
      </Grid.Col> */}

      <Grid.Col span={4}>
        <Card />
      </Grid.Col>
    </Grid>
  );
};
