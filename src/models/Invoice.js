const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  logo: {
    type: String,
  },
  invoiceNumber: {
    type: String,
    // unique: true
  },
  invoiceDate: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  // add new field schema
  addField: [],
  // addField: {
  //   type: String
  // },
  selectedOption: {
    type: String
  },

  businessName: {
    type: String,
  },
  email: {
    type: String,
    // value: "1"
  },
  phone: {
    type: String,
  },
  GST: {
    type: String,
  },
  pan: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  zip: {
    type: String,
  },
  state: {
    type: String,
  },
  // client schema
  selectedOption2: [],

  clientBusinessName: {
    type: String,
  },
  clientEmail: {
    type: String,
  },
  clientPhone: {
    type: String,
  },
  clientGST: {
    type: String,
  },
  clientPan: {
    type: String,
  },
  clientAddress: {
    type: String,
  },
  clientCity: {
    type: String,
  },
  clientZip: {
    type: String,
  },
  clientState: {
    type: String,
  },
  // item field schema
  ItemField: [],

  discount: {
    type: String,
  },
  signature: {
    type: String,
  },
  signatureLabel: {
    type: String,
  },
  termCondition: [],
  date: {
    type: Date,
    default: Date.now,
  },
  buff: Buffer,
});
module.exports = mongoose.model("Invoice", InvoiceSchema);
