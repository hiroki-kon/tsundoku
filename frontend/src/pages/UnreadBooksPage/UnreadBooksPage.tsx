/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import {
  Loader,
  SimpleGrid,
  ActionIcon,
  Modal,
  useMantineTheme,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaPlus, FaRegEdit, FaCheck } from "react-icons/fa";
import { UnreadBookPostForm } from "../../components/UnreadBookPostForm";
import { Methods as UnreadBookMethod } from "../../../../types/generated/api/unread-books";
import classes from "./UnreadBooksPage.module.css";
import { UnreadBook } from "../../components/UnreadBook";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const [isEditable, setIsEditable] = useState<boolean>(false);


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
                status={elem.status}
                piledUpAt={elem.piledUpAt}
                isEditable={isEditable}
                isUnread={elem.status === "積読"}
                onClickDeleteButton={async () => {
                  await axios.delete(
                    `${apiEndpoint}/unread-books/${elem.unreadBookId}`
                  );

                  mutate(
                    data?.filter(
                      (item) => item.unreadBookId !== elem.unreadBookId
                    ),
                    false
                  );
                }}
                onClickFinishReadingButton={async () => {
                  await axios.put(
                    `${apiEndpoint}/unread-books/${elem.unreadBookId}/status`,
                    { ...elem, status: "読了" }
                  );

                  mutate(
                    data?.map((item) =>
                      item.unreadBookId === elem.unreadBookId
                        ? { ...item, status: "読了" }
                        : item
                    )
                  );
                }}
              />
            ))}
          </>
        )}
      </SimpleGrid>
      <Stack className={classes.editButtons}>
        <ActionIcon
          className={classes.edit}
          variant="default"
          size="xl"
          radius="xl"
          aria-label="Settings"
          onClick={() => setIsEditable((preState) => !preState)}
        >
          {isEditable === false ? (
            <FaRegEdit style={{ width: "30%", height: "30%" }} />
          ) : (
            <FaCheck style={{ width: "30%", height: "30%" }} />
          )}
        </ActionIcon>
        {isEditable === false && (
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
        )}
      </Stack>
    </>
  );
};
