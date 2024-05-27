import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage/SignInPage";
import { UnreadBooksPage } from "./pages/UnreadBooksPage";
import { DashBoardPages } from "./pages/DashBoardPage";
import { useAuth } from "./hooks/useAuth";
import { WithAuth } from "./WithAuth";

function App() {
  const { isSignIn, userName, signOut } = useAuth();

  return (
    <MantineProvider>
      <Header
        isSignIn={isSignIn}
        userName={userName}
        onClickSignOut={() => {
          signOut();
        }}
      />
      <Routes>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />

        <Route
          path="unread"
          element={
            <WithAuth
              isSignIn={isSignIn}
              component={<UnreadBooksPage />}
              redirectTo="/signin"
            />
          }
        />
        <Route
          path="dashboard"
          element={
            <WithAuth
              isSignIn={isSignIn}
              component={<DashBoardPages />}
              redirectTo="/signin"
            />
          }
        />

        <Route
          path="/"
          element={
            <WithAuth
              isSignIn={isSignIn}
              component={<DashBoardPages />}
              redirectTo="/signin"
            />
          }
        />
      </Routes>
    </MantineProvider>
  );
}

export default App;
