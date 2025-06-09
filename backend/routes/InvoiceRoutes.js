const express = require('express');
const router = express.Router();
const YourModel = require('../Models/Invoice');

// POST: Add new invoice data
router.post('/', async (req, res) => {
  try {
    const { companyName, clientDetails, invoiceDetails, products, totals, invoiceNumber } = req.body;

    // Validate required fields
    if (!companyName || !clientDetails || !invoiceDetails || !products || !totals || !invoiceNumber || isNaN(invoiceNumber)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // Generate the next invoice number if not provided
    const lastInvoice = await YourModel.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 101;

    const newInvoice = new YourModel({
      invoiceNumber: invoiceNumber || nextInvoiceNumber,
      companyName,
      clientDetails,
      invoiceDetails,
      products,
      totals,
    });

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error('Error saving invoice:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch the next invoice number
router.get('/next-invoice-number', async (req, res) => {
  try {
    const { companyName } = req.query; // Get the company name from the query parameters

  

    // Find the last invoice for the given company
    const lastInvoice = await YourModel.findOne({ companyName }).sort({ invoiceNumber: -1 });

    let nextInvoiceNumber = 101; // Default starting number

    if (lastInvoice && typeof lastInvoice.invoiceNumber === 'number') {
      nextInvoiceNumber = lastInvoice.invoiceNumber + 1;
    }

    res.status(200).json({ nextInvoiceNumber });
  } catch (err) {
    console.error('Error fetching next invoice number:', err);
    res.status(500).json({ error: err.message });
  }
});
// GET: Fetch all invoices
// GET: Fetch invoices (filtered by company name if provided)
router.get('/', async (req, res) => {
  try {
    const { companyName } = req.query;

    let query = {};

    if (companyName) {
      query.companyName = companyName;
    }

    const invoices = await YourModel.find(query);
    res.status(200).json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await YourModel.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error fetching invoice by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete invoice by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedInvoice = await YourModel.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ error: err.message });
  }
});
// PUT: Update invoice by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedInvoice = await YourModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(updatedInvoice);
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;