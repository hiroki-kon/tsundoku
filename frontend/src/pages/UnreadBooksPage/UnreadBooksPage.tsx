/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { Loader, Grid, ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaPlus } from "react-icons/fa6";
import { UnreadBookPostForm } from "../../components/UnreadBookPostForm/UnreadBookPostForm";
import { Methods as UnreadBookMethod } from "../../../../types/generated/api/unread-books";
import classes from "./UnreadBooksPage.module.css";

type UnreadBook = UnreadBookMethod["get"]["resBody"];

import { UnreadBook } from "../../components/UnreadBook";

const fetcher: Fetcher<UnreadBook, string> = (url) =>
  axios.get(url).then((res) => res.data);

const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

export const UnreadBooksPage = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `${apiEndpoint}/unread-books?userId=0`,
    fetcher
  );

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {" "}
      <Modal opened={opened} onClose={close} title="積ん読の登録">
        hoge
      </Modal>
      <Grid className={classes.grid} mx="auto">
        {isLoading ? (
          <Loader color="blue" />
        ) : (
          <>
            {" "}
            {data?.map((elem, i) => (
              <Grid.Col key={i} span={3}>
                <UnreadBook
                  bookCoverUrl={elem.bookCoverUrl}
                  bookTitle={elem.bookName}
                ></UnreadBook>
              </Grid.Col>
            ))}
          </>
        )}
      </Grid>
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
