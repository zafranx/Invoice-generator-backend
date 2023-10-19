const mongoose = require("mongoose");
const mongoURl = process.env.MONGO_URL;

const connectToMongo = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURl, () => {
    console.log("Connected to Mongooes  Successfully!");
  });
};

// // payment instance
// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_APT_SECRET,
// });

module.exports = connectToMongo;
// if mongoose not connect automatically so add id address in mongodb atlas  from network access









