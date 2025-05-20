const mongoose = require("mongoose");

const connectionString = process.env.connectionString;

mongoose
  .connect(connectionString, { connectiontimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.log(err);
  });
