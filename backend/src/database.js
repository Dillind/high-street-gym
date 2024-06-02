// set up MySQL database connection with mysql2
import mysql from "mysql2/promise";
import "dotenv/config";

// create database connection
export const db = mysql.createPool({
  host: "localhost",
  user: "hsg-app",
  password: "abc123",
  database: "high-street-gym",
});

// create a function that checks for a successful connection

async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();

    if (connection) {
      console.log("Connected to the 'high-street-gym' database!");

      connection.release();
    }
  } catch (error) {
    console.log(error);
  }
}

testDatabaseConnection();
