import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [property, setProperty] = useState([]);
  const [tempProperty, setTempProperty] = useState([]);
  const [search, setSearch] = useState("");
  const [errtag, setErrtag] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userType") !== null) {
      setUserType(localStorage.getItem("userType") === "true");
      setIsLoggedIn(true);
    } else {
      setUserType(false);
      setIsLoggedIn(false);
    }
  }, [userType]);

  const routeUser = () => {
    if (userType) {
      navigate("/seller", { replace: true });
    } else {
      navigate("/buyer", { replace: true });
    }
  };

  useEffect(() => {
    async function getProperty() {
      try {
        const properties = (await axios.get("http://localhost:8081/property"))
          .data;
        setProperty(properties);
        setErrtag("");
        if (
          localStorage.getItem("userType") !== null &&
          JSON.parse(localStorage.getItem("userType")) === false
        ) {
          setProperty(
            properties.filter(
              (prop) =>
                prop.buyers.filter(
                  (buyer) =>
                    buyer.userId ===
                    JSON.parse(localStorage.getItem("user")).userId
                ).length === 0
            )
          );
          if (property.length === 0) {
            setErrtag("No Property to choose from for now");
          }
        }
      } catch (error) {
        if (
          error.response.data === "There exists no property in the database"
        ) {
          setErrtag("Currently no property is available");
        }
      }
    }
    getProperty();
  }, [property.length]);

  const addBuyer = async (event, prop) => {
    await axios
      .post(
        `http://localhost:8081/property/${prop.propId}/buyer/${
          JSON.parse(localStorage.getItem("user")).userId
        }`
      )
      .then(
        () => {
          navigate("/", { replace: true });
          setErrtag("");
        },
        (error) => {
          setErrtag(error.response.data);
        }
      );
  };

  const readToggle = (propId) => {
    setTempProperty((properties) =>
      properties.map((prop) => {
        if (prop.propId === propId) {
          return {
            ...prop,
            toBeVisible: !prop.toBeVisible,
          };
        }
        return prop;
      })
    );
  };
  const cards = tempProperty.map((prop) => {
    return (
      <div class="card text-center" key={prop.propId}>
        <div class="card-header">Name: {prop.propName}</div>
        <div class="card-body">
          <h5 class="card-text">
            {prop.propDescription.substring(0, 50)}
            {prop.toBeVisible ? prop.propDescription.substring(50) : "..."}
          </h5>
          <button
            class="btn btn-primary"
            onClick={() => readToggle(prop.propId)}
          >
            {prop.toBeVisible ? "...Collapse" : "Read More..."}
          </button>
          {localStorage.getItem("user") !== null &&
          JSON.parse(localStorage.getItem("userType")) === false ? (
            <button
              className="btn btn-info"
              style={{ marginLeft: "5px" }}
              onClick={(e) => addBuyer(e, prop)}
            >
              Interested
            </button>
          ) : (
            ""
          )}
          <p class="card-text">Location: {prop.propLocation}</p>
        </div>
        <div class="card-footer text-muted">
          Seller: {prop.seller.sellerName}
        </div>
      </div>
    );
  });

  useEffect(() => {
    if(search.length>0){
      setErrtag("");
      setTempProperty(
        property.filter(
          (prop) =>
            prop.propName.toLowerCase().includes(search.toLowerCase()) ||
            prop.propLocation.toLowerCase().includes(search.toLowerCase()) ||
            prop.seller.sellerName.toLowerCase().includes(search.toLocaleLowerCase())
        )
      );
    }else{
      setTempProperty([]);
      setErrtag("Search By Name, Location and Seller of Property, or Select All to get list of all property")
    }
  }, [search,property]);

  const selectAll=()=>{
    if(property.length>tempProperty.length){
    setTempProperty(property);
    setErrtag('');
    }
    else{
      setTempProperty([]);
      setErrtag("Search By Name, Location and Seller of Property, or Select All to get list of all property")
    }
    
  }
  return (
    <div className="container-fluid home-style">
      
        {isLoggedIn ? (
          userType ? (
            <div className="container-fluid" style={{ display: "flex",justifyContent: "right", padding: "5px" }}>
            <button
              className="btn btn-secondary"
              onClick={routeUser}
              
            >
              Seller &#x2937;
            </button>
            </div>
          ) : (<div className="container-fluid" style={{ display: "flex",justifyContent: "right", padding: "5px" }}>
            <button className="btn btn-secondary" onClick={routeUser}>
              Buyer &#x2937;
            </button>
          </div>
            
          )
        ) : (
          ""
        )}
        
      <div className="container-fluid search-box">
        <h1>PROPERT EYE</h1>
        <p>:- One Marketplace for all</p>
        <input
          type="text"
          className="search-bar"
          name="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <span className="btn btn-primary" onClick={selectAll}>All</span>
      </div>

      {errtag.length > 0 ? (
                  <div className="error-message">{errtag}</div>
                ) : (
                  ""
                )}
      
      <div className="container-fluid card-style">{cards}</div>
    </div>
  );
}

export default Home;
