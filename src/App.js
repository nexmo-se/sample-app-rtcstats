import './App.css';
import '@vonagevolta/volta2/dist/css/volta.min.css';
import Video from './components/Video/Video';
import Header from './components/Header/Header';
// import ToolBar from './components/ToolBar';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

let primary = process.env.REACT_APP_PALETTE_PRIMARY || '#b779ff';
let secondary = process.env.REACT_APP_PALETTE_SECONDARY || '#d6219c';

const theme = () => {
  return createTheme({
    palette: {
      type: 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      bodyBackground: {
        black: '#131415',
      },
      callBackground: {
        main: '#20262D',
      },
      toolbarBackground: {
        main: '#41464D',
      },
      activeButtons: {
        green: '#1C8731',
        red: '#D50F2C',
      },
    },
  });
};

function App() {
  return (
    <ThemeProvider theme={theme()}>
      <div className="App">
        {/* <Header/> */}
        <Video />
        {/* <ToolBar /> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
