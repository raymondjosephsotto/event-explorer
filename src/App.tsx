import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import EventExplorerContainer from './containers/EventExplorerContainer';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0d1117",   // VSCode-like deep black background
      paper: "#161b22",     // VSCode surface / panel gray
    },
    divider: "#30363d",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <EventExplorerContainer />
    </ThemeProvider>
  );
}

export default App
