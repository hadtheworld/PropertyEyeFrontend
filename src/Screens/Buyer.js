import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Buyer() {

  // const propertyFormat={
  //   propName: String,
  //   propDescription: String,
  //   propLocation: String
  // }
  const navigate = useNavigate();
  const [property, setProperty] = useState([]);
  const [errTag,setErrtag] =useState("");
  const routeUser = () => {
      navigate(-1, { replace: true });
  };
  useEffect(() => {
    
    async function getProperty() {
      
      try {
        const properties = (await axios.get(`http://localhost:8081/user/buyer/${JSON.parse(localStorage.getItem("user")).userId}`))
          .data;
          if(properties.length === 0){
            throw new Error("empty");
          }
        setProperty(properties);
        setErrtag("");
      } catch (error) {
        if(error.message === "empty"){
          setErrtag("Currently No Property choosen please select from the properties");
          return
        }
        if (
          error.response.data === "Wrong Id given, No record found at it"
        ) {
          setErrtag("Wrong User Logged In, Illegal Login");
        }
        
      }
    }

    
    getProperty();
  }, []);

  const readToggle = (propId) => {
    setProperty((properties) =>
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

  const cards = property.map((prop) => {
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
          <p class="card-text">Location: {prop.propLocation}</p>
        </div>
        <div class="card-footer text-muted">
        <div className="row">
                  <div className="col"><b>Seller:</b> {prop.seller.sellerName}</div>
                  <div className="col">{prop.seller.sellerPhone} 	&#x1F4DE;</div>
                </div>
        </div>
      </div>
    );
  });
  // useEffect(()=>{
  //   setUser(JSON.parse(localStorage.getItem("user")))
  // },[user]);

  return (
    <div>
      <div className="container-fluid profile">
      </div>
      <div className="container-fluid" style={{ display: "flex",justifyContent: "left", padding: "5px" }}>
      <button
        className="btn btn-secondary"
        onClick={routeUser}
        style={{ margin: "3px", float: "left" }}
      >
        &#x2190; &#127968;
      </button>
      </div>
      {errTag}
      {/* {JSON.stringify(property)} */}
      {/* {JSON.stringify(user.userId)} */}
      <div className="container-fluid card-style">{cards}</div>
    </div>
  );
}

export default Buyer;
