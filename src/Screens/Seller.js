import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Seller() {
  const navigate = useNavigate();
  const [toggleForm, setToggleForm] = useState(false);
  const [property, setProperty] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const routeUser = () => {
    navigate(-1, { replace: true });
  };
  const toggleProductForm = () => {
    setToggleForm(!toggleForm);
  };

  const propertyRequest = async (event) => {
    event.preventDefault();
    await axios
      .post(
        `http://localhost:8081/property/${
          JSON.parse(localStorage.getItem("user")).sellerId
        }/add`,
        {
          propName: event.target.name.value,
          propDescription: event.target.description.value,
          propLocation: event.target.location.value,
        }
      )
      .then(
        (resp) => {
          setProperty([...property, resp.data]);
          setErrMsg("");
          toggleProductForm();
        },
        (error) => {
          setErrMsg(error.response.data);
        }
      );
      
  };

  useEffect(() => {
    async function getSellerProperty() {
      await axios
        .get(
          `http://localhost:8081/seller/${
            JSON.parse(localStorage.getItem("user")).sellerId
          }/property`
        )
        .then(
          (resp) => {
            setProperty(resp.data);
            setErrMsg("");
          },
          (error) => {
            setErrMsg(error.response.data);
          }
        );
    }
    getSellerProperty();
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
      <div class="card" key={prop.propId}>
        <div class="card-header">
          <div style={{ float: "left", padding: "5px" }}>
            Property: {prop.propName}
          </div>
          <div style={{ float: "right" }}>
            {prop.toBeVisible ? (
              <button
                className="btn btn-secondary"
                onClick={() => readToggle(prop.propId)}
              >
                Hide Buyers &#x25BC;
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => readToggle(prop.propId)}
              >
                Show Buyers &#x25B2;
              </button>
            )}
          </div>
        </div>
        {prop.toBeVisible ? 
        <div className="card-body">
        {prop.toBeVisible
          ? prop.buyers.map((buyer) => {
              return (
                <div className="row" key={buyer.userId}>
                  <div className="col"><b>Name:</b> {buyer.userName}</div>
                  <div className="col">{buyer.userPhone} 	&#x1F4DE;</div>
                </div>
              );
            })
          : ""}
      </div>:
      ""
      }
      </div>
    );
  });
  return (
    <div>
      <div className="container-fluid" style={{ display: "flex",justifyContent: "left", padding: "5px" }}>
      <button
        className="btn btn-secondary"
        onClick={routeUser}
        style={{ margin: "3px", float: "left" }}
      >
        &#x2190; &#127968;
      </button>
      </div>
      
      {toggleForm ? (
        <div style={{ display: "grid", placeItems: "center" }}>
          <button
            className="btn btn-success"
            onClick={toggleProductForm}
            style={{ margin: "3px" }}
          >
            Register Product &#x25BC;
          </button>
          <div
            className="container-fluid"
            style={{ width: "60%", height: "100%" }}
          >
            <div class="card">
              <div class="card-header"> Enter New Product</div>
              <div class="card-body">
                <form onSubmit={propertyRequest}>
                  <div className="row" style={{ padding: "10px" }}>
                    <div className="form-group col">
                      <label
                        htmlFor="prop-name"
                        style={{ float: "left", margin: "3px" }}
                      >
                        Property Name:
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="huse, shop.."
                        id="prop-name"
                        name="name"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col">
                      <label
                        htmlFor="prop-location"
                        style={{ float: "left", margin: "3px" }}
                      >
                        Property Location:
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="city, state.."
                        id="prop-location"
                        name="location"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ padding: "10px" }}>
                    <label
                      htmlFor="prop-desc"
                      style={{ float: "left", margin: "3px" }}
                    >
                      Property Description:
                    </label>
                    <textarea
                      id="prop-desc"
                      name="description"
                      rows={5}
                      className="form-control"
                    />
                  </div>
                  <div style={{ padding: "10px" }}>
                    <button
                      className="btn btn-info"
                      style={{ float: "left", paddingInline: "10px" }}
                    >
                      Add
                    </button>
                  </div>
                </form>
                {errMsg.length > 0 ? (
                  <div className="error-message">{errMsg}</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", placeItems: "center" }}>
          <button
            className="btn btn-success"
            onClick={toggleProductForm}
            style={{ margin: "3px" }}
          >
            Register Product &#x25B2;
          </button>
        </div>
      )}
      
      <div className="container-fluid card-style">{cards}</div>
    </div>
  );
}

export default Seller;
