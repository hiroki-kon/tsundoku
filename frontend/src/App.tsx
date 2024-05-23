import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage/SignInPage";
import { UnreadBooksPage } from "./pages/UnreadBooksPage";

function App() {
  return (
    <MantineProvider>
      <Header />
      <Routes>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />

        <Route path="unread-books" element={<UnreadBooksPage />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
