const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// Create a connection to the database (using connection pooling is recommended for performance)
const pool = mysql.createPool({
  host: "salik-api-database.cwfjz6cyloxy.me-south-1.rds.amazonaws.com", // Database host
  user: "admin", // Database username
  password: "JgRToE1FmG1U8Md", // Database password
  database: "Customer_Details", // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to execute SQL queries
const executeQuery = async (query) => {
  try {
    const [rows] = await pool.promise().query(query);
    return rows; // Return the query result
  } catch (err) {
    console.error("Error executing query:", err);
    throw err; // Rethrow to handle the error in the main route
  }
};

// Route to get customer details
router.get("/customer_details", async (req, res) => {
  try {
    const customerID = req.query.customer_id;
    // Define queries to get different images related to the customer
    // const customerID = 28261; // You can make this dynamic if necessary

    console.log(customerID);

    // Execute queries sequentially (using async/await for better error handling)
    const query1 = `SELECT mulkiya_front FROM Image_details WHERE customerid=${customerID} AND mulkiya_front IS NOT NULL`;
    const query2 = `SELECT mulkiya_back FROM Image_details WHERE customerid=${customerID} AND mulkiya_back IS NOT NULL`;
    const query3 = `SELECT driving_front FROM Image_details WHERE customerid=${customerID} AND driving_front IS NOT NULL`;
    const query4 = `SELECT driving_back FROM Image_details WHERE customerid=${customerID} AND driving_back IS NOT NULL`;
    const query5 = `SELECT emirates_front FROM Image_details WHERE customerid=${customerID} AND emirates_front IS NOT NULL`;
    const query6 = `SELECT emirates_back FROM Image_details WHERE customerid=${customerID} AND emirates_back IS NOT NULL`;

    // Execute all queries concurrently
    const results = await Promise.all([
      executeQuery(query1),
      executeQuery(query2),
      executeQuery(query3),
      executeQuery(query4),
      executeQuery(query5),
      executeQuery(query6),
    ]);

    // Combine the results into a single object

    const transformedJson = {
      "Emirates ID": {
        "ID Number":
          results[4][0].emirates_front["ID Number"].extracted_content,
        Name: results[4][0].emirates_front["Name"].extracted_content,
        "Date of Birth":
          results[4][0].emirates_front["Date of Birth"].extracted_content,
        Nationality:
          results[4][0].emirates_front["Nationality"].extracted_content,
        "Issuing Date":
          results[4][0].emirates_front["Issuing Date"].extracted_content,
        "Expiry Date":
          results[4][0].emirates_front["Expiry Date"].extracted_content,
        Sex: results[4][0].emirates_front["Sex"].extracted_content,
        "Card Number":
          results[5][0].emirates_back["Card Number"].extracted_content,
        Occupation: results[5][0].emirates_back["Occupation"].extracted_content,
        "Employer or Sponsor":
          results[5][0].emirates_back["Employer or Sponsor"].extracted_content,
        "Issuing Place":
          results[5][0].emirates_back["Issuing Place"].extracted_content,
      },
      "Drivers License": {
        "License No":
          results[2][0].driving_front["License No"].extracted_content,
        Name: results[2][0].driving_front["Name"].extracted_content,
        Nationality:
          results[2][0].driving_front["Nationality"].extracted_content,
        "Date of Birth":
          results[2][0].driving_front["Date of Birth"].extracted_content,
        "Issue Date":
          results[2][0].driving_front["Issue Date"].extracted_content,
        "Expiry Date":
          results[2][0].driving_front["Expiry Date"].extracted_content,
        "Place of Issue":
          results[2][0].driving_front["Place of Issue"].extracted_content,
        "Traffic Code No.":
          results[3][0].driving_back["Traffic Code No."].extracted_content,
        "Permitted Vehicles":
          results[3][0].driving_back["Permitted Vehicles"].extracted_content,
      },
      Mulkiya: {
        "Traffic Plate No.":
          results[0][0].mulkiya_front["Traffic Plate No."].extracted_content,
        "Place of Issue":
          results[0][0].mulkiya_front["Place of Issue"].extracted_content,
        "T.C. No": results[0][0].mulkiya_front["T.C. No"].extracted_content,
        Owner: results[0][0].mulkiya_front["Owner"].extracted_content,
        Nationality:
          results[0][0].mulkiya_front["Nationality"].extracted_content,
        "Expiry Date":
          results[0][0].mulkiya_front["Expiry Date"].extracted_content,
        "Reg. Date": results[0][0].mulkiya_front["Reg. Date"].extracted_content,
        "Ins. Exp. Date":
          results[0][0].mulkiya_front["Ins. Exp. Date"].extracted_content,
        "Policy No.":
          results[0][0].mulkiya_front["Policy No."].extracted_content,
        Model: results[1][0].mulkiya_back["Model"].extracted_content,
        "Num of Pass":
          results[1][0].mulkiya_back["Num of Pass"].extracted_content,
        Origin: results[1][0].mulkiya_back["Origin"].extracted_content,
        "Veh. Type": results[1][0].mulkiya_back["Veh. Type"].extracted_content,
        "Eng. No.": results[1][0].mulkiya_back["Eng. No."].extracted_content,
        "Chassis No.":
          results[1][0].mulkiya_back["Chassis No."].extracted_content,
      },
    };

    // console.log(JSON.stringify(transformedJson, null, 2));

    // Send the response
    res.status(200).json(transformedJson);
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/driving", async (req, res) => {
  try {
    const customerID = req.query.customer_id;
    // Define queries to get different images related to the customer
    // const customerID = 28261; // You can make this dynamic if necessary

    console.log(customerID);

    // Execute queries sequentially (using async/await for better error handling)

    const query3 = `SELECT driving_front FROM Image_details WHERE customerid=${customerID} AND driving_front IS NOT NULL`;
    const query4 = `SELECT driving_back FROM Image_details WHERE customerid=${customerID} AND driving_back IS NOT NULL`;

    // Execute all queries concurrently
    const results = await Promise.all([
      executeQuery(query3),
      executeQuery(query4),
    ]);

    // res.status(200).json(results);

    // Combine the results into a single object

    const transformedJson = {
      "Drivers License": {
        "License No":
          results[0][0].driving_front["License No"].extracted_content,
        Name: results[0][0].driving_front["Name"].extracted_content,
        Nationality:
          results[0][0].driving_front["Nationality"].extracted_content,
        "Date of Birth":
          results[0][0].driving_front["Date of Birth"].extracted_content,
        "Issue Date":
          results[0][0].driving_front["Issue Date"].extracted_content,
        "Expiry Date":
          results[0][0].driving_front["Expiry Date"].extracted_content,
        "Place of Issue":
          results[0][0].driving_front["Place of Issue"].extracted_content,
        "Traffic Code No.":
          results[1][0].driving_back["Traffic Code No."].extracted_content,
        "Permitted Vehicles":
          results[1][0].driving_back["Permitted Vehicles"].extracted_content,
      },
    };

    // console.log(JSON.stringify(transformedJson, null, 2));

    // Send the response
    res.status(200).json(transformedJson);
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/emirates", async (req, res) => {
  try {
    const customerID = req.query.customer_id;
    // Define queries to get different images related to the customer
    // const customerID = 28261; // You can make this dynamic if necessary

    console.log(customerID);

    // Execute queries sequentially (using async/await for better error handling)

    const query5 = `SELECT emirates_front FROM Image_details WHERE customerid=${customerID} AND emirates_front IS NOT NULL`;
    const query6 = `SELECT emirates_back FROM Image_details WHERE customerid=${customerID} AND emirates_back IS NOT NULL`;

    // Execute all queries concurrently
    const results = await Promise.all([
      executeQuery(query5),
      executeQuery(query6),
    ]);

    // res.status(200).json(results);

    // Combine the results into a single object

    const transformedJson = {
      "Emirates ID": {
        "ID Number":
          results[0][0].emirates_front["ID Number"].extracted_content,
        Name: results[0][0].emirates_front["Name"].extracted_content,
        "Date of Birth":
          results[0][0].emirates_front["Date of Birth"].extracted_content,
        Nationality:
          results[0][0].emirates_front["Nationality"].extracted_content,
        "Issuing Date":
          results[0][0].emirates_front["Issuing Date"].extracted_content,
        "Expiry Date":
          results[0][0].emirates_front["Expiry Date"].extracted_content,
        Sex: results[0][0].emirates_front["Sex"].extracted_content,
        "Card Number":
          results[1][0].emirates_back["Card Number"].extracted_content,
        Occupation: results[1][0].emirates_back["Occupation"].extracted_content,
        "Employer or Sponsor":
          results[1][0].emirates_back["Employer or Sponsor"].extracted_content,
        "Issuing Place":
          results[1][0].emirates_back["Issuing Place"].extracted_content,
      },
    };

    // console.log(JSON.stringify(transformedJson, null, 2));

    // Send the response
    res.status(200).json(transformedJson);
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/mulkiya", async (req, res) => {
  try {
    const customerID = req.query.customer_id;
    // Define queries to get different images related to the customer
    // const customerID = 28261; // You can make this dynamic if necessary

    console.log(customerID);

    // Execute queries sequentially (using async/await for better error handling)
    const query1 = `SELECT mulkiya_front FROM Image_details WHERE customerid=${customerID} AND mulkiya_front IS NOT NULL`;
    const query2 = `SELECT mulkiya_back FROM Image_details WHERE customerid=${customerID} AND mulkiya_back IS NOT NULL`;

    // Execute all queries concurrently
    const results = await Promise.all([
      executeQuery(query1),
      executeQuery(query2),
    ]);

    // Combine the results into a single object

    const transformedJson = {
      Mulkiya: {
        "Traffic Plate No.":
          results[0][0].mulkiya_front["Traffic Plate No."].extracted_content,
        "Place of Issue":
          results[0][0].mulkiya_front["Place of Issue"].extracted_content,
        "T.C. No": results[0][0].mulkiya_front["T.C. No"].extracted_content,
        Owner: results[0][0].mulkiya_front["Owner"].extracted_content,
        Nationality:
          results[0][0].mulkiya_front["Nationality"].extracted_content,
        "Expiry Date":
          results[0][0].mulkiya_front["Expiry Date"].extracted_content,
        "Reg. Date": results[0][0].mulkiya_front["Reg. Date"].extracted_content,
        "Ins. Exp. Date":
          results[0][0].mulkiya_front["Ins. Exp. Date"].extracted_content,
        "Policy No.":
          results[0][0].mulkiya_front["Policy No."].extracted_content,
        Model: results[1][0].mulkiya_back["Model"].extracted_content,
        "Num of Pass":
          results[1][0].mulkiya_back["Num of Pass"].extracted_content,
        Origin: results[1][0].mulkiya_back["Origin"].extracted_content,
        "Veh. Type": results[1][0].mulkiya_back["Veh. Type"].extracted_content,
        "Eng. No.": results[1][0].mulkiya_back["Eng. No."].extracted_content,
        "Chassis No.":
          results[1][0].mulkiya_back["Chassis No."].extracted_content,
      },
    };

    // console.log(JSON.stringify(transformedJson, null, 2));

    // Send the response
    res.status(200).json(transformedJson);
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
