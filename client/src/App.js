import axios from "axios";
import "./App.css";
import React, { useState, useEffect } from "react";
import Layout from "./Layout";

function App() {
  return <Layout />;
  // const [fullName, setFullName] = useState("");

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   axios.post("/api/scratch/create", { fullName }).then((res) => {
  //     console.log(res);
  //   });
  // };
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <p>Testing Scratch template creation</p>
  //       <input
  //         type="text"
  //         value={fullName}
  //         onChange={(e) => setFullName(e.target.value)}
  //         placeholder="Enter full name"
  //         style={{ marginBottom: "10px" }}
  //       ></input>
  //       <button className="btn" onClick={(e) => onSubmit(e)}>
  //         Test
  //       </button>
  //     </header>
  //   </div>
  // );
}

export default App;
