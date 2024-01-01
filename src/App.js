import "./App.css";
import Sudoko from "./components/Sudoko";

function App() {
  const instegram =  ()=>{
    window.open("https://www.instagram.com/rillwan.tech/");
  }
  return (
    <div className="App">
      <div className="App__header">
        <div className="container">
          <h3 className="heading">Sudoku Game</h3>
          <div className="Game__body">
            <Sudoko />
          </div>
        </div>
      </div>
      {/* ==== Footer ======= */}
      <div className="footer" onClick={instegram}>
        &copy;2023 India, All Rights Reserved by Rillwan.tech
      </div>
    </div>
  );
}

export default App;
