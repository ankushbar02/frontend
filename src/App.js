import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Read from "./components/Read/Read";
import Update from "./components/Update/Update";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";

import SignUp from "./components/Login/SignUp";
import WrongPage from "./components/WrongPage";
import Create from "./components/Create/Create";
function App() {
  return (
    <div className="App ">
      <BrowserRouter>
    
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/readnotes" element={<Read />}></Route>
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/create" element={<Create />} />
            <Route exact path="/update/:id" element={<Update />}></Route>
            <Route path="*" element={<WrongPage />} />
          </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
