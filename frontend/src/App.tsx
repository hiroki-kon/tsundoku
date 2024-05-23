import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Header } from "./components/Header";

function App() {
  return (
    <MantineProvider>
      <Header />
    </MantineProvider>
  );
}

export default App;
