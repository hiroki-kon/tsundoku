/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { Methods } from "../../../../types/generated/api/unread-books/amount";
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
import classes from ".//DashBoardPages.module.css";
import { StatsCard } from "../../components/StatsCard";

const fetcher: Fetcher<Methods["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
export const DashBoardPages = () => {
  const {
    data: amount,
    error,
    isLoading,
    mutate,
  } = useSWR(`${apiEndpoint}/unread-books/amount`, fetcher);

  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    if (error) {
      if (error.response.status === 401) {
        navigate("/signin");
      }
    }
  }, [error, navigate]);

  console.log(amount);

  return (
    <Grid className={classes.container} bg={theme.colors.gray[2]}>
      <Grid.Col span={3}>
        <StatsCard
          title="積読の総額"
          text={`¥ ${amount?.totalAmount?.toLocaleString()}`}
        />
      </Grid.Col>

      <Grid.Col span={3}>
        <StatsCard
          title="積読の総額"
          text={`¥ ${amount?.totalAmount?.toLocaleString()}`}
        />
      </Grid.Col>
    </Grid>
  );
};
