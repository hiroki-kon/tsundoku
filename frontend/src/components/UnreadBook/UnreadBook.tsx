import { Card, Image, Text, Badge, Group } from "@mantine/core";

interface Props {
  bookCoverUrl: string | null | undefined;
  bookTitle: string | undefined;
  tags?: string[];
}

export const UnreadBook = (props: Props) => {
  const { bookCoverUrl, bookTitle, tags } = props;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={280} mih={350}>
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

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{bookTitle}</Text>
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
