
const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/initiate-payout", async (req, res) => {
  const { name, upi } = req.body;

  try {
    const contact = await razorpay.contacts.create({
      name: name,
      type: "employee",
      email: `${name.toLowerCase()}@example.com`,
      contact: "9123456789",
    });

    const fundAccount = await razorpay.fundAccount.create({
      contact_id: contact.id,
      account_type: "vpa",
      vpa: { address: upi },
    });

    const payout = await razorpay.payouts.create({
      account_number: "2323230076543210",
      fund_account_id: fundAccount.id,
      amount: 200000,
      currency: "INR",
      mode: "UPI",
      purpose: "payout",
      queue_if_low_balance: true,
    });

    res.json({
      status: "success",
      message: "Payout successful",
      payout_id: payout.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.error?.description || "Payout failed",
    });
  }
});

app.get("/", (req, res) => {
  res.send("EarnGati Razorpay Backend Running (Demo Mode)");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
