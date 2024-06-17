const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./utils/connectDB");
const cors = require("cors");

//Importing all the routes
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const productRoute = require("./routes/product-route");
const cartRoute = require("./routes/cart-route");
const orderRoute = require("./routes/order-route");
dotenv.config();

// Setup for JSON data
app.use(express.json());

// sever static file
app.use(express.static('./'))

// Setting up the cors policy
const corsOptions = {
    origin: ['http://localhost:5173',process.env.FRONTEND_URL],
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
  };


// Apply the cors policy
app.use(cors(corsOptions));

// Handle JSON 
app.use(express.json())

// Write all the routers
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

// Configuring the server
const PORT = process.env.PORT || 3000;
const SERVER = process.env.SERVER || "localhost";

// Starting the server on DB connection
connectDB()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server running at http://${SERVER}:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
