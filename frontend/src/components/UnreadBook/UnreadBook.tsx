import {
  Card,
  Image,
  Text,
  Badge,
  Box,
  Tooltip,
  ActionIcon,
  Button,
  Flex,
} from "@mantine/core";
import { FaMinus } from "react-icons/fa";

import dayjs from "dayjs";
import classes from "./UnreadBook.module.css";

interface Props {
  bookCoverUrl: string | null | undefined;
  bookTitle: string | undefined;
  tags?: string[];
  status: string | null | undefined;
  price: number | undefined;
  piledUpAt: string | undefined;
  isEditable: boolean;
  isUnread: boolean;
  onClickDeleteButton: () => void;
  onClickFinishReadingButton: () => void;
}

export const UnreadBook = (props: Props) => {
  const {
    bookCoverUrl,
    bookTitle,
    tags,
    status,
    price,
    piledUpAt,
    isEditable,
    isUnread,
    onClickDeleteButton,
    onClickFinishReadingButton,
  } = props;
  return (
    <Box className={classes.container}>
      {isEditable && (
        <ActionIcon
          variant="filled"
          color="red"
          radius="xl"
          aria-label="Settings"
          className={classes.deleteButton}
          onClick={() => onClickDeleteButton()}
        >
          <FaMinus style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      )}

      <Card shadow="sm" padding="lg" radius="md" withBorder w={280} h={430}>
        <Card.Section>
          <Image
            src={bookCoverUrl}
            height={180}
            alt="Norway"
            fit="contain"
            radius="md"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          />
        </Card.Section>

        <Card.Section mt="xs" mb="xs" p={20} pb={0}>
          <Badge variant="outline" color="blue" radius="md">
            {status}
          </Badge>
          <Tooltip label={bookTitle}>
            <Text fw={700} lineClamp={2}>
              {bookTitle}
            </Text>
          </Tooltip>

          <Box>
            <Text size="sm">定価: {price} 円 </Text>
            <Text size="sm">
              積み始めた日: {dayjs(piledUpAt).format("YYYY年 MM月 DD日")}
            </Text>
            <Text size="sm">
              積んでる日数: {dayjs(dayjs()).diff(piledUpAt, "day")}
            </Text>
          </Box>

          <Flex>
            <Text size="sm">タグ:</Text>
            {tags !== undefined &&
              tags.map((tag, i) => (
                <Badge key={i} color="blue">
                  {tag}
                </Badge>
              ))}
          </Flex>
        </Card.Section>
        {isUnread && (
          <Button
            variant="filled"
            size="sm"
            radius="lg"
            onClick={() => onClickFinishReadingButton()}
          >
            読了
          </Button>
        )}
      </Card>
    </Box>
  );
};
