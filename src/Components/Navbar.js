import React, { useEffect, useState } from "react";
import logo from "../Images/logo.avif";
import { Modal} from "react-bootstrap";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import './Authstyle.css';
function Navbar(props) {
  const style = {
    margin: "3px",
  };
  const sellerFormat = {
    sellerId: Number,
    sellerName: String,
    sellerEmail: String,
    sellerPassword: String,
    sellerPhone: Number,
    sellerAddress: String,
    sellerType: Boolean,
  };
  const buyerFormat = {
    userId: Number,
    userName: String,
    userEmail: String,
    userPassword: String,
    userPhone: Number,
    userAddress: String,
    userType: Boolean,
  };
  const [loginData, setLoginData] = useState(sellerFormat);
  const [loginUserData, setLoginUserData] = useState(buyerFormat);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState({});
  const phoneRegex = /^[789]{1}[0-9]{8}/;
  const navigate=useNavigate();
  // const [email, setEmail]=useState("");

  const closeLogin=()=>{
    setEmail("");
    setPassword("");
    setIsSeller(false);
    setErrMsg("");
    setShowLogin(false);
  }
  const closeRegister=()=>{
    setEmail("");
    setPassword("");
    setIsSeller(false);
    setErrMsg("");
    setAddress("");
    setPhone({});
    setUserName("");
    setShowRegister(false);
  }
  useEffect(()=>{
    if(!loginData.sellerId.isNaN)
    {
    props.userData(loginData);
    closeLogin();
    window.location.reload(false);
    navigate("/seller",{replace: true})
    return
  }
    if(!loginUserData.userId.isNaN)
    {
    props.userData(loginUserData);
    closeLogin();
    window.location.reload(false);
    navigate("/buyer",{replace: true})
    return
  }
/* eslint-disable */ 
  },[loginData,loginUserData,props])
/* eslint-enable */ 
  const toggleHome=()=>{
    navigate("/home",{replace : true});
  }


  const toggleRegister = () => {
    closeLogin();
    setShowRegister(true);
    setAddress("");
    setPhone(0);
    setUserName("");
    setLoginData(sellerFormat);
    setLoginUserData(buyerFormat);
  };

  const toggleLogin = () => {
    closeRegister();
    setShowLogin(true);
    setLoginData(sellerFormat);
    setLoginUserData(buyerFormat);
  };
  const loginRequest = async (event) => {
    event.preventDefault();
    if (isSeller) {
      await axios
        .post("http://localhost:8081/seller/login", {
          emailId: email,
          password: password,
        })
        .then(
          (resp) => {
            setShowLogin(false);
            setLoginData(()=>{
              return {
                ...resp.data,
                type: resp.data.sellerType
              }
            });
            
            // props.userData(loginData);
            setErrMsg("");
            setLoginUserData(buyerFormat);
          },
          (error) => {
            if (error.response.data === "seller not found") {
              setErrMsg(
                "This seller does not exists, Try Registering Yourself"
              );
              setLoginData(sellerFormat);
              setLoginUserData(buyerFormat);
            }
          }
        );
    } else {
      await axios.post("http://localhost:8081/user/login", {
          emailId: email,
          password: password,
        }).then((resp)=>{
          // Modal.openCount = 0;
            setLoginUserData(()=>{
              return {
                ...resp.data,
                type: resp.data.userType
              }
            });
            // props.userData(loginUserData);
            setErrMsg("");
            setLoginData(sellerFormat);
      },(error)=>{
            if (error.response.data === "user not found") {
              setErrMsg("This Buyer does not exists, Try Registering Yourself");
              setLoginUserData(buyerFormat);
              setLoginData(sellerFormat);
            }
          });
    }
  };

  const phoneVerify = (event) => {
    if (phoneRegex.test(phone.prop)) {
      setPhone(() => {
        return {
          prop: event.target.value.replace(/\D/g, "").substring(0, 10),
          errMsg: "",
        };
      });
    } else {
      setPhone(() => {
        return {
          prop: event.target.value.replace(/\D/g, "").substring(0, 10),
          errMsg:
            "phone n.o should start with 789 and have 10 characters at the least",
        };
      });
    }
  };

  const registerRequest = async (event) => {
    event.preventDefault();
    if (isSeller) {
      await axios.post("http://localhost:8081/seller", {
        sellerName: name,
        sellerEmail: email,
        sellerPassword: password,
        sellerPhone: phone.prop,
        sellerAddress: address,
        sellerType: isSeller,
      }).then(
        () => {
          setErrMsg("");
          setLoginUserData(buyerFormat);
          toggleLogin();
        },
        (error) => {
          setErrMsg(error.response.data);
          setLoginData(sellerFormat);
          setLoginUserData(buyerFormat);
        }
      );
    }
    else{
      
      await axios.post("http://localhost:8081/user", {
        userName: name,
        userEmail: email,
        userPassword: password,
        userPhone: phone.prop,
        userAddress: address,
        userType: isSeller,
      })
        .then(
          () => {
            setErrMsg("");
            setLoginData(sellerFormat);
            toggleLogin();
          },
          (error) => {
              setErrMsg(error.response.data);
              setLoginUserData(buyerFormat);
              setLoginData(sellerFormat);
            
          }
        );
    }
  };

  const logout=()=>{
    localStorage.clear();
    // window.location.reload(true);
    navigate('/',{replace : true})
    setAddress("");
    setEmail("");
    setErrMsg("");
    setIsSeller(false);
    setPassword("");
    setPhone(0);
    setUserName("");
    setLoginData(sellerFormat);
    setLoginUserData(buyerFormat);
    // window.location.reload(false);
  }
  return (
    <div >
      <Modal  show={showLogin} onHide={()=>closeLogin()} style={{top : "25%"}}>
        <Modal.Header className="modal-header" closeButton>
          <Modal.Title className="modal-title">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <form onSubmit={(e) => loginRequest(e)}>
            <div class="form-group row">
              <label htmlFor="inputEmail3" class="col-sm-2 col-form-label">
                Email
              </label>
              <div class="col-sm-10">
                <input className="input"
                  type="email"
                  class="form-control"
                  id="inputEmail3"
                  placeholder="Email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                required/>
              </div>
            </div>
            <div class="form-group row">
              <label htmlFor="inputPassword3" class="col-sm-2 col-form-label">
                Password
              </label>
              <div class="col-sm-10">
                <input
                  type="password"
                  class="form-control"
                  id="inputPassword3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                required/>
              </div>
            </div>
            <fieldset class="form-group">
              <div class="row">
                <label class="col-form-label col-sm-2 pt-0">User </label>
                <div class="col-sm-10">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="seller"
                      id="seller"
                      value="seller"
                      checked={!isSeller}
                      onChange={(e) => {
                        if (e.target.checked) setIsSeller(false);
                      }}
                    />
                    <label class="form-check-label" htmlFor="seller">
                      Buyer
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="seller"
                      id="seller"
                      value="seller"
                      checked={isSeller}
                      onClick={(e) => {
                        if (e.target.checked) setIsSeller(true);
                      }}
                    />
                    <label class="form-check-label" htmlFor="seller">
                      Seller
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="form-group row">
              <div class="col-sm-10">
                <button type="submit" class="btn btn-primary">
                  Sign in
                </button>
              </div>
            </div>
          </form>
          <span
            onClick={toggleRegister}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Register?
          </span>
          :{errMsg.length>0 ? <div className="error-message">{errMsg}</div>:""}
        </Modal.Body>
      </Modal>
      <Modal show={showRegister} onHide={()=>closeRegister()} style={{top : "5%"}}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={registerRequest}>
            <div class="form-group">
              <label for="userName">Name:</label>
              <input
                type="text"
                class="form-control"
                id="userName"
                value={name}
                autoComplete="off"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div class="form-group">
              <label for="userEmail">Email:</label>
              <input
                type="email"
                class="form-control"
                id="userEmail"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div class="form-group">
              <label for="userPassword">Password:</label>
              <input
                type="password"
                class="form-control"
                id="userPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div class="form-group">
              <label for="userPhone">Phone:</label>
              <input
                type="text"
                class="form-control"
                id="userPhone"
                value={phone.prop}
                autoComplete="off"
                onChange={phoneVerify}
                placeholder="Enter your phone number"
              />
              <span className="error-style">{phone.errMsg}</span>
            </div>
            <div class="form-group">
              <label for="userAddress">Address:</label>
              <textarea
                class="form-control"
                id="userAddress"
                rows="3"
                value={address}
                autoComplete="off"
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
              ></textarea>
            </div>
            <fieldset class="form-group">
              <div class="row">
                <legend class="col-form-label col-sm-2 pt-0">Radios</legend>
                <div class="col-sm-10">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="seller"
                      id="seller"
                      value="seller"
                      checked={!isSeller}
                      onChange={(e) => {
                        if (e.target.checked) setIsSeller(false);
                      }}
                    />
                    <label class="form-check-label" htmlFor="seller2">
                      Buyer
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="seller"
                      id="seller2"
                      value="seller"
                      checked={isSeller}
                      onChange={(e) => {
                        if (e.target.checked) setIsSeller(true);
                      }}
                    />
                    <label class="form-check-label" htmlFor="seller">
                      Seller
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="form-group row">
              <div class="col-sm-10">
                <button type="submit" class="btn btn-primary">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
          <span
            onClick={toggleLogin}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Login?:
          </span>
          {errMsg.length>0 ? <div className="error-message">{errMsg}</div>:""}
        </Modal.Body>
      </Modal>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <span class="navbar-brand"  onClick={toggleHome} style={{cursor : "pointer"}}>
          <img
            src={logo}
            width="40"
            height="40"
            margin="20"
            class="d-inline-block align-top"
            alt=""
          />
          PropertyEyE
        </span>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navToggle"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navToggle">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              {localStorage.getItem("user")==null?<button
                class="btn btn-outline-primary"
                style={style}
                onClick={() => setShowLogin(true)}
              >
                login
              </button>:<button
                class="btn btn-outline-primary"
                style={style}
                onClick={logout}
                type="submit"
              >
                Logout
              </button>}
            </li>
            <li class="nav-item active">
              <button
                class="btn btn-outline-primary"
                style={style}
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
