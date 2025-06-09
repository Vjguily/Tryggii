const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  natureOfGoods: String,
  unitRate: String,
  quantity: String,
  vatRate: String,
  totalExclVAT: String,
  vatAmount: String,
  totalInclVAT: String,
  unit: String, // Add this field for Unit/Hour
  productDescription: String, // Add this field for productDescription
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: Number,
    required: true,
   // Ensure invoice numbers are unique
  },
  companyName: {
    type: String,
    required: true, // Make it required if necessary
  },
  clientDetails: {
    clientName: String,
    clientAddress: String,
    clientDistrict: String,
    clientPostalCode: String,
    clientCountry: String,
    clientAddNo: String,
    clientVatNumber: String,
    clientCRN: String,
  },
  invoiceDetails: {
    invoiceDate: String,
    supplyDate: String,
    contractNo: String,
    invoicePeriod: String,
    projectRefNo: String,
  },
  products: [ProductSchema],
  totals: {
    totalExclVAT: String,
    totalVAT: String,
    totalInclVAT: String,
    balanceDue: String,
  },
});

// Add compound index
InvoiceSchema.index({ companyName: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
