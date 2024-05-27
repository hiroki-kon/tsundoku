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
  Menu,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiBooksLight } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";

import classes from "./Header.module.css";
import { TagsForm } from "../TagsForm";

interface Props {
  isSignIn: boolean;
  userName: string;
  onClickSignOut: () => void;
}

export const Header = ({ isSignIn, userName, onClickSignOut }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();
  const location = useLocation();

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      {" "}
      <Modal opened={opened} onClose={close} title="タグの編集">
        <TagsForm />
      </Modal>
      <header className={classes.header}>
        <Title className={classes.title} order={2}>
          積ん読!
        </Title>

        {isSignIn && (
          <>
            <Tabs
              defaultValue={
                location.pathname === "/unread" ? "Books" : "Dashboard"
              }
            >
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
                  onClick={() => navigate("/unread")}
                >
                  積ん読
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Menu>
              <Menu.Target>
                <UnstyledButton variant="default" className={classes.user}>
                  <Group>
                    <Avatar
                      src={null}
                      alt="no image here"
                      radius="xl"
                      size={40}
                    />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {userName}
                    </Text>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={open}>タグの設定</Menu.Item>
                <Menu.Item color="red" onClick={() => onClickSignOut()}>
                  サインアウト
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        )}
      </header>
      <Divider />
    </>
  );
};
