require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    public_key: process.env.STRIPE_PUBLIC_KEY,
  });
});

const items = [
  { id: 1, name: "React book", price: 100 },
  { id: 2, name: "Node book", price: 200 },
];

app.post("/createCheckoutSession", async (req, res) => {
  try {
    let session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "books",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:8000/success",
      cancel_url: "http://localhost:8000/fail",
    });
    res.json({
      success: true,
      message: "done",
      url: session.url,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/fail", (req, res) => {
  res.render("fail");
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.listen(8000, () => console.log(`Ap running in port ${8000}`));
