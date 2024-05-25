/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import {
  Loader,
  SimpleGrid,
  ActionIcon,
  Modal,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaPlus } from "react-icons/fa6";
import { UnreadBookPostForm } from "../../components/UnreadBookPostForm";
import { Methods as UnreadBookMethod } from "../../../../types/generated/api/unread-books";
import classes from "./UnreadBooksPage.module.css";
import { UnreadBook } from "../../components/UnreadBook";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const fetcher: Fetcher<UnreadBookMethod["get"]["resBody"], string> = (url) =>
  axios.get(url).then((res) => res.data);

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

dayjs.extend(timezone);
dayjs.extend(utc);

export const UnreadBooksPage = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${apiEndpoint}/unread-books`,
    fetcher
  );

  console.log(data);

  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    if (error) {
      if (error.response.status === 401) {
        navigate("/signin");
      }
    }
  }, [error, navigate]);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {" "}
      <Modal opened={opened} onClose={close} title="積ん読の登録">
        <UnreadBookPostForm
          onSubmit={async (values) => {
            const addOBj = {
              bookName: values.title,
              bookCoverUrl: values.coverUrl,
              status: values.status,
              bookPrice: values.price,
              piledUpAt: dayjs(values.piledUpAt).tz("Asia/Tokyo").toISOString(),
            };
            await axios.post(`${apiEndpoint}/unread-books`, addOBj);
            mutate(data !== undefined ? [addOBj, ...data] : [addOBj], false);
            close();
          }}
        />
      </Modal>
      <SimpleGrid
        className={classes.grid}
        mx="auto"
        bg={theme.colors.gray[2]}
        cols={4}
      >
        {isLoading ? (
          <Loader color="blue" />
        ) : (
          <>
            {" "}
            {data?.map((elem, i) => (
              <UnreadBook
                key={i}
                bookCoverUrl={elem.bookCoverUrl}
                bookTitle={elem.bookName}
                price={elem.bookPrice}
                piledUpAt={elem.piledUpAt}
              ></UnreadBook>
            ))}
          </>
        )}
      </SimpleGrid>
      <ActionIcon
        className={classes.add}
        variant="filled"
        size="xl"
        radius="xl"
        aria-label="Settings"
        onClick={open}
      >
        <FaPlus style={{ width: "30%", height: "30%" }} />
      </ActionIcon>
    </>
  );
};
