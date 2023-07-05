import "./App.css";
import Navbar from "./Components/Navbar";
/* eslint-disable */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
/* eslint-enable */
import Home from "./Screens/Home";
function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" exact Component={Home} />
          <Route path="/" element={ <Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
