require("dotenv").config();
const express = require("express");
// const paymentRoute = require("./src/routes/paymentRoutes");

//  cors is used to fix error , front end se direct api hit nhi kar sakte error aati hai isliye cors use karte hai
const cors = require("cors");
const connectToMongo = require("./src/Database/config");
connectToMongo();
const app = express();
app.use(cors());

const port = process.env.PORT || 8000;
app.use(express.json());


// multer
// must use this code to show image in frontend page
app.use("/Form_Images", express.static("Form_Images"));
app.use(express.urlencoded({ extended: true }));

// Available Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/invoice", require("./src/routes/invoiceForm"));

//rozarpay payment gateway api
app.use("/api", require("./src/routes/paymentRoutes"));
app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);



app.get("/", (req, res) => res.send("Hello Developer Z"));
app.listen(port, () => {
  console.log(`Admin Panel  listening at {port}`);
});
