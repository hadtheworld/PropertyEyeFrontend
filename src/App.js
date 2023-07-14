import "./App.css";
import Navbar from "./Components/Navbar";
/* eslint-disable */
import {
  Navigate,
  Route,
  Routes,
  
} from "react-router-dom";
/* eslint-enable */
import Home from "./Screens/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import Seller from "./Screens/Seller";
import Buyer from "./Screens/Buyer";
import { useState } from "react";
import ProtectedRouteBuyer from "./Components/ProtectedRouteBuyer";

function App() {
  const [user, setUser] = useState({});
  

  
  const getUserData = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userType", user.type);
   
  };

  return (
    <div className="App">
      <Navbar userData={getUserData} />
      {/* {JSON.stringify(user)} */}
      {/* {isLoggedIn? 'yes':'no'} */}
      {/* {userType? 'yes':'no'} */}
  
      <Routes>
        <Route path="/home" exact Component={Home} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/seller"
          element={
            <ProtectedRoute 
              isLoggedIn={localStorage.getItem("user") !== null}
              userType={localStorage.getItem("userType") === "true"}
            >
              <Seller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer"
          element={
            <ProtectedRouteBuyer 
              isLoggedIn={localStorage.getItem("user") !== null}
              userType={localStorage.getItem("userType") === "true"}
            >
              <Buyer />
            </ProtectedRouteBuyer>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
