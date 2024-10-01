const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const transactionRoutes = require("./routes/transactionRoutes"); // Ensure the correct path
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

connectDB();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! Working API')
})
// Routes
app.use("/api/transactions", transactionRoutes); // Ensure this line is correct

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
