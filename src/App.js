import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Read from "./components/Read/Read";
import Update from "./components/Update/Update";
import Navbar from "./components/Navbar";
import Login from "./components/Login/Login";

import SignUp from "./components/Login/SignUp";
import WrongPage from "./components/WrongPage";
function App() {
  return (
    <div className="App ">
  
      <CookiesProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/readnotes" element={<Read />}></Route>
            <Route exact path="/signup" element={<SignUp />} /> 
            <Route exact path="/update/:id" element={<Update />}></Route>
            <Route path="*" element={<WrongPage />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </div>
  );
}

export default App;
