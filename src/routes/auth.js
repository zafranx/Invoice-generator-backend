//  In This Auth have Regester Api, Login,Forget, Reset,UserDetails,Email Verify
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "scienceislife";
var fetchuser = require("../middleware/fetchuser");
let success = false;

const nodemailer = require("nodemailer");
const { validate } = require("../models/User");
// const transporter = nodemailer.createTransport({
//   secure:'gmail',
//   auth:{
//     // user:"khanzafran8349gmail.com",
//     // pass:"aavcxyxxvesyqpeh"
//     user: "saurabh123815@gmail.com",
//     pass: "mqopvbwgvtzyypns",
//   },
//     tls: {
//     rejectUnauthorized: false,
//   },
// });
let smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    //  user: "saurabh123815@gmail.com",
    //  pass: "mqopvbwgvtzyypns",
    user: "khanzafran8349@gmail.com",
    pass: "hepzwmvtxuenrnks",
  },
};
let transporter = nodemailer.createTransport(smtpConfig);

// ROUTE 1: Create a User using: POST "/api/auth/register". No login required
router.post(
  "/register",
  [
    body("username", "username must be atleast 2 characters").isLength({
      min: 2,
    }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be atleast min 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log(req.body);
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        // success = false;
        return res
          .status(400)
          .json({
            success: "false",
            error: "Sorry a user with this email already exists",
          });
      }
      // for password hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      let randomNumber = Math.floor(1000 + Math.random() * 9000);
      // create a new user
      user = await User.create({
        username: req.body.username,
        password: secPass,
        email: req.body.email,
        otp: randomNumber,
        verification: false,
      });
      // const data = {
      //   user: {
      //     id: user.id,
      //   },
      // };
      // const authtoken = jwt.sign(data, JWT_SECRET);
      // console.log(authtoken)

      // // res.json(user);
      //  success = true;
      // res.json({success, authtoken });

      const mailOptions = {
        from: '"Verfiy your email " <...zafran@gmail.com>',
        to: user.email,
        subject: "Verification",
        html: `
        <h2> ${user.username} Thanks for registering on our site </h2>
        <h4> Please verify your mail to continue....</h4>
        <h1>${randomNumber}</h1>
        <br/>
        <br/>
        <h3>Please Click below link or Copy link and paste in browser to verify otp </h3>
        <h3>http://localhost:3000/auth-two-step-verification</h3>
         <a href="http://localhost:3000/auth-two-step-verification"><h2> Click to Verify </h2></a> 
        <h3>If you didn’t request this email, please ignore this message.This email was sent automatically by system, please do not reply.</h3>
           <h3> Copyright © ${new Date(
          user.date
        ).getFullYear()} Admin Skote all rights reserved. </h3>
        `,
      };
      // sending mail
      transporter.sendMail(mailOptions, (err, resp) => {
        if (err) {
          console.error("error", err);
        } else {
          console.log("Mail Sent To Your Given Gmail : Please Verify With OTP");
          // console.log("resp",resp)
        }
      });
      success = true;
      return res.status(200).json({
        success,
        successs: "Regester Successfully: Please verify Your Email to Login",
      });
    } catch (error) {
      // catch error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE:2  Verify Email Otp
router.post(
  "/verify-email",
  // [body("otp", "Otp must be atleast 4 digits").isLength({ min: 4, max:4 }),],
  async (req, res) => {
    console.log("req.body", req.body);
    // If there are errors, return Bad request and the errors
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { email, otp } = req.body;
    // let  otp = digit1+digit2+digit3+digit4
    console.log("otp", otp);
    console.log("email", email);
    try {
      let user = await User.findOne({ email: email, otp: otp });
      console.log(user);
      if (user) {
        (user.otp = null), (user.verification = true), await user.save();

        const data = {
          user: {
            id: user.id,
          },
        };

        const authtoken = jwt.sign(data, JWT_SECRET);
        //  console.log(authtoken)
        (success = true), "OTP Has Been Validated Successfully";
        res.json({ authtoken, success });
        // return res
        //   .status(200)
        //   .json({success :'true', Res: "Otp Verified Successfully" });
      } else {
        return res
          .status(404)
          .json({ success: "false", Error: "Otp is not Valid or did't match" });
      }
      // Otp = await User.findByIdAndDelete(req.body.otp);
      // res.json({success:"otp deleted"})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// resend otp  not in use
router.post("/resend-otp", async (req, res) => {
  // const Otp = await User.find({ user: req.user.id });
  let user = await User.findOne({
    email: req.body.email,
    username: req.body.username,
    otp: req.body.otp,
    date: req.body.date,
  });
  try {
    const mailOptions = {
      from: '"Verfiy your email " <...zafran@gmail.com>',
      to: user.email,
      subject: "Verification",
      html: `
        <h2> ${user.username} Thanks for registering on our site </h2>
        <h4> Please verify your mail to continue....</h4>
        <h1>${user.otp}</h1>
        <br/>
        <br/>
        <h3>Please Click below link or Copy link and paste in browser to verify otp </h3>
        <h3>http://localhost:3000/auth-two-step-verification</h3>
         <a href="http://localhost:3000/auth-two-step-verification"><h2> Click to Verify </h2></a> 
        <h3>If you didn’t request this email, please ignore this message.This email was sent automatically by system, please do not reply.</h3>
           <h3> Copyright © ${new Date(
        user.date
      ).getFullYear()} Admin Skote all rights reserved. </h3>
        `,
    };
    // sending mail
    transporter.sendMail(mailOptions, (err, resp) => {
      if (err) {
        console.error("error", err);
      } else {
        console.log("Mail Sent To Your Given Gmail : Please Verify With OTP");
        // console.log("resp",resp)
      }
    });
    success = true;
    return res.status(200).json({
      success,
      successs: "Regester Successfully: Please verify Your Email to Login",
    });
  } catch (error) {
    // catch error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "pasword can't be blank").exists(),
  ],

  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, verification } = req.body;
    try {
      let user = await User.findOne({ email: email }); // {email:email,verification:true} it can be used in the place of !user.verification
      console.log("user", user);
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      if (!user.verification) {
        return res
          .status(400)
          .json({ error: "please verify your email to continue" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Password is Incoreect",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 4: Get loggedin User Details using: POST "/api/auth/userdetails". Login required

router.post("/userdetails", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      success = false;
      return res.status(400).json({
        success,
        error: "Error",
      });
    } else {
      success = true;
      res.json({ success, user });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 5: Forget password Api /api/auth/forget-password .No Login Requird
router.post("/forget-password", async (req, res) => {
  // const {email}=req.body
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ error: "Email Does not exists " });
    }
    const mailOptions = {
      from: '"Reset your Password " <...zafran@gmail.com>',
      to: user.email,
      subject: "Reset Password",
      html: `
        <h3>Please Click below link or Copy link and paste in browser to Rest Your Password </h3>
         <a href="http://localhost:3000/Recoverpw"><h2> Click Here To Reset </h2></a> 
        <h3>If you didn’t request this email, please ignore this message.This email was sent automatically by system, please do not reply.</h3>
           <h3> Copyright © ${new Date(
        user.date
      ).getFullYear()} Admin Skote all rights reserved. </h3>
        `,
    };
    // sending mail
    transporter.sendMail(mailOptions, (err, resp) => {
      if (err) {
        console.error("error", err);
      } else {
        console.log("Mail Sent To Your Given Gmail : Reset Your Password");
        // console.log("resp",resp)
      }
    });

    return res.status(200).json({ success: "Reset Link Sent To Your Mail" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
  // end bracket
});

//  ROUTE:6 Reset Password
router.put(
  "/reset-password",
  [
    body("password", "password must be atleast min 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findById({});
    } catch (error) { }
  }
);

router.put('/update-profile/:id',
  [
    body("username", "username must be atleast 2 characters").isLength({ min: 2 }),
    // body("email", "enter a valid email").isEmail(),
    // body("password", "password must be atleast min 6 characters").isLength({ min: 6, }),
  ], validate,
  async (req, res) => {

    const { username } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newProfile = {}
      if (username) {
        newProfile.username = username
      }


      let user = await User.findById(req.params.id)
      console.log("user", user)
      if (!user) {
        return res.status(404).send("Not Found");
      }
      user = await User.findByIdAndUpdate(
        // { email: email },
        req.params.id,
        { $set: newProfile },
        { new: true }
      )
      res.json({ user });

    } catch (error) {
      console.error("catch error", error.message);
      res.status(500).send({ success: false, message: error.message, err: "Internal Server Error" });
    }
  })

// pushpe api 
// router.put("/update/client/:id", verifyToken, async (request, response) => {
//   console.log("edit/id", request.params.id)
//   const {
//     name,
//     username,
//     password,
//   } = request.body

//   console.log("name", password)
//   if (password) {
//     const salt = await bcrypt.genSalt(10)
//     const pw = await bcrypt.hash(password, salt)
//     console.log("body", request.body)
//     let result = await admins.findOneAndUpdate({
//       _id: request.params.id
//     }, {
//       $set: {
//         name: name,
//         username: username,
//         password: pw,
//       }
//     }
//     )
//     console.log("result1", result)
//     if (result) {
//       response.send(result)
//     } else {
//       response.status(203).send({
//         result: 'something went wrong'
//       })
//     }
//   } else {
//     console.log("body", request.body)
//     let result = await admins.findOneAndUpdate({
//       _id: request.params.id
//     }, {
//       $set: {
//         name: name,
//         username: username,

//       }
//     }
//     )
//     console.log("result1", result)
//     if (result) {
//       response.send(result)
//     } else {
//       response.status(203).send({
//         result: 'something went wrong'
//       })
//     }
//   }

// })

module.exports = router;
