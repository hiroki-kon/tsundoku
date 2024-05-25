import { Card, Image, Text, Badge, Group, Box, Tooltip } from "@mantine/core";
import dayjs from "dayjs";

interface Props {
  bookCoverUrl: string | null | undefined;
  bookTitle: string | undefined;
  tags?: string[];
  price: number | undefined;
  piledUpAt: string | undefined;
}

export const UnreadBook = (props: Props) => {
  const { bookCoverUrl, bookTitle, tags, price, piledUpAt } = props;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={280} h={400}>
      <Card.Section>
        <Image
          src={bookCoverUrl}
          height={200}
          alt="Norway"
          fit="contain"
          radius="md"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
      </Card.Section>

      <Group mt="md" mb="xs">
        <Tooltip label={bookTitle}>
          <Text fw={500} lineClamp={2}>
            {bookTitle}
          </Text>
        </Tooltip>

        <Box>
          <Text size="md">定価: {price} 円 </Text>
          <Text size="md">
            積み始めた日: {dayjs(piledUpAt).format("YYYY年 MM月 DD日")}
          </Text>
          <Text size="md">
            積んでる日数: {dayjs(dayjs()).diff(piledUpAt, "day")}
          </Text>
        </Box>

        {tags !== undefined &&
          tags.map((tag, i) => (
            <Badge key={i} color="blue">
              {tag}
            </Badge>
          ))}
      </Group>
    </Card>
  );
};
