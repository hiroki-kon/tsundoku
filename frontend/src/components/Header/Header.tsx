/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Title,
  Divider,
  Tabs,
  rem,
  Avatar,
  Text,
  Group,
  UnstyledButton,
} from "@mantine/core";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiBooksLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import classes from "./Header.module.css";

interface Props {
  isSignIn: boolean;
  userName: string;
}

export const Header = ({ isSignIn, userName }: Props) => {
  const navigate = useNavigate();

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      <header className={classes.header}>
        <Title className={classes.title} order={2}>
          積ん読!
        </Title>

        {isSignIn && (
          <>
            <Tabs defaultValue="Dashboard">
              <Tabs.List>
                <Tabs.Tab
                  value="Dashboard"
                  leftSection={<MdOutlineSpaceDashboard style={iconStyle} />}
                  onClick={() => navigate("/dashboard")}
                >
                  ダッシュボード
                </Tabs.Tab>
                <Tabs.Tab
                  value="Books"
                  leftSection={<PiBooksLight style={iconStyle} />}
                  onClick={() => navigate("/unread-books")}
                >
                  積ん読
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <UnstyledButton variant="default" className={classes.user}>
              <Group>
                <Avatar src={null} alt="no image here" radius="xl" size={40} />
                <Text fw={500} size="sm" lh={1} mr={3}>
                  {userName}
                </Text>
              </Group>
            </UnstyledButton>
          </>
        )}
      </header>
      <Divider />
    </>
  );
};
