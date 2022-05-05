import './App.css';
import '@vonagevolta/volta2/dist/css/volta.min.css';
import Video from './components/Video/Video';
import Header from './components/Header/Header';
import ToolBar from './components/ToolBar/ToolBar';

function App() {
  return (
    <div className="App">
      {/* <Header/> */}
      <Video />
      <ToolBar />
    </div>
  );
}

export default App;
