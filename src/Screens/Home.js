import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  

  const [property, setProperty] = useState([]);
  const [errtag, setErrtag] = useState("");
  useEffect(() => {
    async function getProperty() {
      try {
        const properties = (await axios.get("http://localhost:8081/property"))
          .data;
        setProperty(properties);
        setErrtag("");
      } catch (error) {
        if (
          error.response.data === "There exists no property in the database"
        ) {
          setErrtag("Currently no property is available");
        }
      }
    }

    getProperty();
  }, []);
  const readToggle = (propId) => {
    setProperty(properties=>properties.map(prop=>{
        if(prop.propId===propId){
            return{
                ...prop,
                toBeVisible: !prop.toBeVisible
            }
        }
        return prop;
    }
    ))
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
          <button class="btn btn-primary" onClick={()=>readToggle(prop.propId)}>
            {prop.toBeVisible ? "...Collapse" : "Read More..."}
          </button>
          <p class="card-text">Location: {prop.propLocation}</p>
        </div>
        <div class="card-footer text-muted">
          Seller: {prop.seller.sellerName}
        </div>
      </div>
    );
  });
 
  return (
    <div className="container-fluid card-style">
      {errtag}
      {/* {JSON.stringify(property)} */}
      {cards}
    </div>
  );
}

export default Home;
