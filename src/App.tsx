import { ThemeProvider, CssBaseline } from "@mui/material";
import EventExplorerContainer from './containers/EventExplorerContainer';
import darkTheme from './theme';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <EventExplorerContainer />
    </ThemeProvider>
  );
}

export default App
