const express = require("express");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const mysql = require("mysql2");

const app = express();

// Function to process driving license data
let mulkiya_front = "";
let mulkiya_back = "";
let emirates_front = "";
let emirates_back = "";
let driving_front = "";
let driving_back = "";
let id_field = "";
let id_data = "";
const processDrivingLicenceData = (
  imageUrl1,
  ID_type,
  userPrompt,
  CustomerID
) => {
  console.log("fetching data from OCR ...... ");
  //   console.log(imageUrl1);
  //   console.log(ID_type);
  //   console.log(userPrompt);
  //   console.log(CustomerID);

  // Simulate fetching token for further API interaction
  let token = "";

  const url = "https://aura-ai.aurainsure.tech/v1/auth";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams();
  body.append("client_id", "1234");
  body.append("client_secret", "aura_ai_master");

  // Fetch the token
  fetch(url, { method: "POST", headers: headers, body: body })
    .then((response) => response.json())
    .then((data) => {
      token = data.access_token; // Use the token for further requests
    })
    .catch((error) => console.error("Error:", error));

  // Create form data to send the image and user prompt
  const form = new FormData();
  axios
    .get(imageUrl1, { responseType: "stream" })
    .then((response1) => {
      form.append("uploaded_files", response1.data, { filename: "image1.jpg" });

      // Append user prompt as JSON
      if (!userPrompt) {
        if (ID_type.toLowerCase().includes("driving_front")) {
          userPrompt = {
            "License No": "str",
            Name: "str",
            Nationality: "str",
            "Date of Birth": "datetime",
            "Issue Date": "datetime",
            "Expiry Date": "datetime",
            "Place of Issue": "str",
          };
        }
        if (ID_type.toLowerCase().includes("driving_back")) {
          userPrompt = {
            "Traffic Code No.": "str",
            "Permitted Vehicles": "str",
          };
        }
        if (ID_type.toLowerCase().includes("emirates_front")) {
          userPrompt = {
            "ID Number": "int",
            Name: "str",
            "Date of Birth": "datetime",
            Nationality: "str",
            "Issuing Date": "datetime",
            "Expiry Date": "datetime",
            Sex: "str",
          };
        }
        if (ID_type.toLowerCase().includes("emirates_back")) {
          userPrompt = {
            "Card Number": "str",
            Occupation: "str",
            "Employer or Sponsor": "str",
            "Issuing Place": "str",
          };
        }
        if (ID_type.toLowerCase().includes("mulkiya_front")) {
          userPrompt = {
            "Traffic Plate No.": "str",
            "Place of Issue": "str",
            "T.C. No": "str",
            Owner: "str",
            Nationality: "str",
            "Expiry Date": "datetime",
            "Reg. Date": "datetime",
            "Ins. Exp. Date": "datetime",
            "Policy No.": "str",
          };
        }
        if (ID_type.toLowerCase().includes("mulkiya_back")) {
          userPrompt = {
            Model: "str",
            "Num of Pass": "int",
            Origin: "str",
            "Veh. Type": "str",
            "Eng. No.": "str",
            "Chassis No.": "str",
          };
        }
      }
      form.append("user_prompt", JSON.stringify(userPrompt));

      // Define API endpoint and Authorization token
      const apiUrl =
        "https://aura-ai.aurainsure.tech/v1/sme/?document_name=emirates-id";
      const authToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb21lIjp7ImNsaWVudF9pZCI6MTIzNCwicHJvZHVjdF9pZHMiOls0LDUsNl0sInByb2R1Y3RfbmFtZXMiOlsic21lIiwiaGVhbHRoIiwiYXV0byJdLCJleHAiOjE3Mzg4MjMzMTkuNzY3NjQ4fX0.wRAI7mvViwwm39yXPC1HnJWGrUBi4uu7YYYlyOm2pgk";

      // Perform the POST request
      axios
        .post(apiUrl, form, {
          headers: {
            ...form.getHeaders(),
            Authorization: "Bearer " + authToken,
            Accept: "application/json",
          },
        })
        .then((response) => {
          if (ID_type.toLowerCase().includes("mulkiya_front")) {
            // mulkiya_front = response.data;
            id_data = response.data[0];
            // id_data = JSON.stringify(id_data).replace("[", "").replace("]", "");
            id_field = "mulkiya_front";
            // console.log(mulkiya_front);
          }

          if (ID_type.toLowerCase().includes("mulkiya_back")) {
            // mulkiya_back = response.data;
            id_data = response.data[0];
            id_field = "mulkiya_back";
          }

          if (ID_type.toLowerCase().includes("driving_front")) {
            // driving_front = response.data;
            id_data = response.data[0];
            id_field = "driving_front";
          }

          if (ID_type.toLowerCase().includes("driving_back")) {
            // driving_back = response.data;
            id_data = response.data[0];
            id_field = "driving_back";
          }

          if (ID_type.toLowerCase().includes("emirates_front")) {
            // emirates_front = response.data;
            id_data = response.data[0];
            id_field = "emirates_front";
          }

          if (ID_type.toLowerCase().includes("emirates_back")) {
            // emirates_back = response.data;
            id_data = response.data[0];
            id_field = "emirates_back";
          }
          // Database insertion and further handling
          const connection = mysql.createConnection({
            host: "salik-api-database.cwfjz6cyloxy.me-south-1.rds.amazonaws.com",
            user: "admin",
            password: "JgRToE1FmG1U8Md",
            database: "Customer_Details",
          });

          connection.connect((err) => {
            if (err) {
              console.error("Error connecting to the database:", err);
              return;
            }
            console.log("Connected to the database!");
          });

          // console.log("id_field :  ", id_field);
          // console.log("id_data :  ", id_data);

          // SQL query to insert data
          // const sql =
          //   "INSERT INTO Image_details (customerid, image_type, image_url, mulkiya_front, mulkiya_back, emirates_front, emirates_back, driving_front, driving_back) VALUES (?, ?, ?, ? ,?, ?, ?, ?, ?)";
          const sql = `INSERT INTO Image_details (customerid, image_type, image_url, ${id_field}) VALUES (?, ?, ?, ? )`;

          connection.execute(
            sql,
            [
              CustomerID,
              ID_type,
              imageUrl1,
              JSON.stringify(id_data),
              // JSON.stringify(mulkiya_front),
              // JSON.stringify(mulkiya_back),
              // JSON.stringify(emirates_front),
              // JSON.stringify(emirates_back),
              // JSON.stringify(driving_front),
              // JSON.stringify(driving_back),
            ], //JSON.stringify(response.data)],
            (err, results) => {
              if (err) {
                console.error("Error inserting data:", err);
                return;
              }
              console.log("Data inserted successfully:");
            }
          );

          // Close the database connection

          connection.end();

          // console.log(response.data);
          console.log("Data received and processed successfully.");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
    });
};

module.exports = { processDrivingLicenceData };
