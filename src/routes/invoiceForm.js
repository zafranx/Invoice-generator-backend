const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const multer = require("multer");
const path = require("path");

router.use(express.urlencoded({ extended: true }));
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "../public/FormImages");
    cb(null, "Form_Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    // cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    //  cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
});

const upload = multer({
  storage: storage,
});
const cpUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "signature", maxCount: 1 },
]);

// router.post("/submit ", cpUpload, async (req, res) => {

//     try {
//         const logo = req.files["logo"][0];
//         const signature = req.files["signature"][0];

//         const { invoiceNumber, invoiceDate, dueDate,
//             businessName, email, phone, GST, pan, address, city, zip, state,
//             clientBusinessName, clientEmail, clientPhone, clientGST, clientPan, clientAddress, clientCity, clientZip, clientState,
//         } = req.body;

//         const invoiceData = await Invoice.create({
//             logo, invoiceNumber, invoiceDate, dueDate,
//             businessName, email, phone, GST, pan, address, city, zip, state,
//             clientBusinessName, clientEmail, clientPhone, clientGST, clientPan, clientAddress, clientCity, clientZip, clientState
//         })
//         // const invoiceData = new Invoice({
//         //     invoiceNumber,
//         //     invoiceDate,
//         //     dueDate,
//         // })

//         if (logo) {
//             invoiceData.logo = logo.path;
//         }
//         if (signature) {
//             invoiceData.signature = signature.path
//         }

//         const savedForm = await invoiceData.save()
//         // .then(() => res.status(200).catch((error) => console.log("error", error)));
//         res.json(savedForm);

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }

// })

//  ROUTE:1 http://localhost:8000/api/invoice/submit_Invoice

router.post("/submit_Invoice", cpUpload, async (req, res) => {
  try {
    console.log("req.body", req.body)
    // let logo = req.files["logo"][0];
    let logo = req.files["logo"];
    const signature = req.files["signature"];
    console.log("logo", logo);
    console.log(signature);

    const obj = JSON.parse(JSON.stringify(req.body));

    // let newAddField = (obj.addField);
    let newSelectedOption = (obj.selectedOption)
    let newSelectedOption2 = (obj.selectedOption2)
    let newTermCondition = JSON.parse(obj.termCondition);
    // let newAddField = JSON.stringify(obj.addField);
    let newAddField = JSON.parse(obj.addField);
    console.log("newAddField", newAddField)
    // let newItemField = (obj.ItemField);
    let newItemField = JSON.parse(obj.ItemField);
    console.log("newItemField", newItemField)
    // console.log(obj, "obj");
    const invoiceData = new Invoice({
      invoiceNumber: obj.invoiceNumber,
      invoiceDate: obj.invoiceDate,
      dueDate: obj.dueDate,
      // addField: obj.addField,
      addField: newAddField,
      // selectedOption: obj.selectedOption,
      selectedOption: newSelectedOption,
      businessName: obj.businessName,
      email: obj.email,
      phone: obj.phone,
      GST: obj.GST,
      pan: obj.pan,
      address: obj.address,
      city: obj.city,
      zip: obj.zip,
      state: obj.state,
      // selectedOption2: obj.selectedOption2,
      selectedOption2: newSelectedOption2,
      clientBusinessName: obj.clientBusinessName,
      clientEmail: obj.clientEmail,
      clientPhone: obj.clientPhone,
      clientGST: obj.clientGST,
      clientPan: obj.clientPan,
      clientAddress: obj.clientAddress,
      clientCity: obj.clientCity,
      clientZip: obj.clientZip,
      clientState: obj.clientState,
      // ItemField: obj.ItemField,
      ItemField: newItemField,
      discount: obj.discount,
      signatureLabel: obj.signatureLabel,
      // termCondition: obj.termCondition,
      termCondition: newTermCondition,

    });
    if (logo) {
      invoiceData.logo = logo[0].path;
      // invoiceData.logo = logo.path;
    }

    if (signature) {
      invoiceData.signature = signature[0].path;
    }

    // let savedForm = await invoiceData
    //   .save()
    //   .then(() => res.send("Successfully Submitted Data"))
    //   .catch((err) => console.log("Failed to Save", err));
    // console.log(savedForm)
    const savedForm = await invoiceData.save().catch((err) => console.log("Failed to Save", err));;
    res.json(savedForm);
    // res.json({ savedForm: savedForm });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//   Route 2: http://localhost:8000/api/invoice/getData
// listing api get data
router.get("/getData", async (req, res) => {
  try {
    const invoiceData = await Invoice.find();
    res.json(invoiceData);
    // console.log("invoiceData", invoiceData)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//   Route 3: http://localhost:8000/api/invoice/getDataById/:id
// get data by id
router.get("/getDataById/:id", async (req, res) => {
  try {
    console.log("paramId", req.params.id);
    const invoiceData = await Invoice.findById(req.params.id);

    if (!invoiceData) {
      return res.status(404).send("Not Found");
    }
    res.json(invoiceData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3: http://localhost:8000/api/invoice/deleteInvoice/:id
router.delete("/deleteInvoice/:id", async (req, res) => {
  try {
    console.log("paramId", req.params.id);
    let invoiceData = await Invoice.findById(req.params.id);

    if (!invoiceData) {
      return res.status(404).send("Not Found");
    }
    // Allow deletion only if user owns this ,  to use this we used to declear FetchUser in router
    // if (invoiceData.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }
    invoiceData = await Invoice.findByIdAndDelete(req.params.id);
    res.json({
      success: "Invoice Deleted Sucessfully",
      invoiceData: invoiceData,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: http://localhost:8000/api/invoice/updateInvoice/:id
// router.put('/updateInvoice/:id', cpUpload, async (req, res) => {

//   try {
//     let logo = req.files["logo"];
//     const signature = req.files["signature"];
//     // // let logo = req.files["logo"][0];
//     // // let signature = req.files["signature"][0];
//     console.log("logo", logo);
//     console.log("signature", signature);
//     // let newTermCondition = JSON.parse(obj.termCondition);
//     // // let newAddField = JSON.stringify(obj.addField);
//     // let newAddField = JSON.parse(obj.addField);
//     // console.log("newAddField", newAddField)
//     // // let newItemField = (obj.ItemField);
//     // let newItemField = JSON.parse(obj.ItemField);
//     // console.log("newItemField", newItemField)
//     const { invoiceNumber, invoiceDate, dueDate, addField,
//       selectedOption, businessName, email, phone, GST, pan, address, city, zip, state,
//       selectedOption2, clientBusinessName, clientEmail, clientPhone, clientGST, clientPan, clientAddress, clientCity, clientState, clientZip,
//       ItemField, discount, termCondition, signatureLabel } = req.body;
//     console.log("body", req.body)
//     const newInvoice = {}
//     if (invoiceNumber) {
//       newInvoice.invoiceNumber = invoiceNumber
//     }
//     if (invoiceDate) {
//       newInvoice.invoiceDate = invoiceDate
//     }
//     if (dueDate) {
//       newInvoice.dueDate = dueDate
//     }
//     if (addField) {
//       newInvoice.addField = addField
//     }
//     if (selectedOption) {
//       newInvoice.selectedOption = selectedOption
//     }
//     if (businessName) {
//       newInvoice.businessName = businessName
//     }
//     if (email) {
//       newInvoice.email = email
//     }
//     if (phone) {
//       newInvoice.phone = phone
//     }
//     if (GST) {
//       newInvoice.GST = GST
//     }
//     if (pan) {
//       newInvoice.pan = pan
//     }
//     if (address) {
//       newInvoice.address = address
//     }
//     if (city) {
//       newInvoice.city = city
//     }
//     if (zip) {
//       newInvoice.zip = zip
//     }
//     if (state) {
//       newInvoice.state = state
//     }
//     if (selectedOption2) {
//       newInvoice.selectedOption2 = selectedOption2
//     }
//     if (clientBusinessName) {
//       newInvoice.clientBusinessName = clientBusinessName
//     }
//     if (clientEmail) {
//       newInvoice.clientEmail = clientEmail
//     }
//     if (clientPhone) {
//       newInvoice.clientPhone = clientPhone
//     }
//     if (clientGST) {
//       newInvoice.clientGST = clientGST
//     }
//     if (clientPan) {
//       newInvoice.clientPan = clientPan
//     }
//     if (clientAddress) {
//       newInvoice.clientAddress = clientAddress
//     }
//     if (clientCity) {
//       newInvoice.clientCity = clientCity
//     }
//     if (clientState) {
//       newInvoice.clientState = clientState
//     }
//     if (clientZip) {
//       newInvoice.clientZip = clientZip
//     }
//     if (ItemField) {
//       newInvoice.ItemField = ItemField
//     }
//     if (discount) {
//       newInvoice.discount = discount
//     }
//     if (termCondition) {
//       newInvoice.termCondition = termCondition
//     }
//     if (signatureLabel) {
//       newInvoice.signatureLabel = signatureLabel
//     }

//     if (logo) {
//       newInvoice.logo = logo[0].path;
//       // newInvoice.logo = logo.path;
//     }

//     if (signature) {
//       newInvoice.signature = signature[0].path;
//     }
//     console.log(req.params.id);
//     let invoice = await Invoice.findById({ _id: req.params.id });
//     if (!invoice) {
//       return res.status(404).send("Not Found");
//     }

//     invoice = await Invoice.findByIdAndUpdate(
//       { _id: req.params.id },
//       { $set: newInvoice },
//       { new: true }
//     );
//     res.json({ invoice })
//   }
//   catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// })

router.put('/updateInvoice/:id', cpUpload, async (req, res) => {

  try {
    let logo = req.files["logo"];
    let signature = req.files["signature"];
    // // let logo = req.files["logo"][0];
    // // let signature = req.files["signature"][0];
    console.log("logo", logo);
    console.log("signature", signature);
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log("object", obj)
    let newSelectedOption = (obj.selectedOption)
    let newSelectedOption2 = (obj.selectedOption2)
    let newTermCondition = JSON.parse(obj.termCondition);

    let newAddField = JSON.parse(obj.addField);
    console.log("newAddField", newAddField)
    // let newItemField = (obj.ItemField);
    let newItemField = JSON.parse(obj.ItemField);
    console.log("newItemField", newItemField)

    const invoiceData = {
      invoiceNumber: obj.invoiceNumber,
      invoiceDate: obj.invoiceDate,
      dueDate: obj.dueDate,
      // addField: obj.addField,
      addField: newAddField,
      // selectedOption: obj.selectedOption,
      selectedOption: newSelectedOption,
      businessName: obj.businessName,
      email: obj.email,
      phone: obj.phone,
      GST: obj.GST,
      pan: obj.pan,
      address: obj.address,
      city: obj.city,
      zip: obj.zip,
      state: obj.state,
      // selectedOption2: obj.selectedOption2,
      selectedOption2: newSelectedOption2,
      clientBusinessName: obj.clientBusinessName,
      clientEmail: obj.clientEmail,
      clientPhone: obj.clientPhone,
      clientGST: obj.clientGST,
      clientPan: obj.clientPan,
      clientAddress: obj.clientAddress,
      clientCity: obj.clientCity,
      clientZip: obj.clientZip,
      clientState: obj.clientState,
      // ItemField: obj.ItemField,
      ItemField: newItemField,
      discount: obj.discount,
      signatureLabel: obj.signatureLabel,
      // termCondition: obj.termCondition,
      termCondition: newTermCondition,

    };


    if (logo) {
      invoiceData.logo = logo[0].path;
      // newInvoice.logo = logo.path;
    }

    if (signature) {
      invoiceData.signature = signature[0].path;
    }
    console.log(req.params.id);
    let invoice = await Invoice.findById({ _id: req.params.id });
    if (!invoice) {
      return res.status(404).send("Not Found");
    }

    invoice = await Invoice.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: invoiceData },
      { new: true }
    );
    res.json({ invoice })
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
