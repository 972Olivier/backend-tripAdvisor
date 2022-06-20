const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const formdata = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const mailgun = new Mailgun(formdata);
const client = mailgun.client({
  username: "Olivier",
  key: process.env.MAILGUN_API_KEY,
});

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/form", (req, res) => {
  console.log(req.fields);
  //   res.json("here");
  const messageData = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: "oliviercen@gmail.com",
    subject: "Formulaire JS",
    text: req.fields.message,
  };

  client.messages
    .create(process.env.MAILGUN_DOMAIN, messageData)
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "email sent" });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
});

app.listen(process.env.PORT, () => {
  console.log("routeur started 🚀");
});
