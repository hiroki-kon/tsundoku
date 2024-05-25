import { Card, Flex, Text } from "@mantine/core";

interface Props {
  title: string;
  text: string;
}

export const StatsCard = ({ title, text }: Props) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" w={250}>
      <Flex>
        <Text c="dimmed">{title}</Text>
      </Flex>
      <Text fw={500} size="xl" mt={"lg"}>
        {text}
      </Text>
    </Card>
  );
};
