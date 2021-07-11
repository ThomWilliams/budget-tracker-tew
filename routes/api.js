const router = require("express").Router();
const Transactions = require("../models/transactions.js");

router.post("/api/transactions", ({body}, res) => {
  Transactions.create(body)
    .then(dbTransactions => {
      res.json(dbTransactions);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.post("/api/transactions/bulk", ({body}, res) => {
  Transactions.insertMany(body)
    .then(dbTransactions => {
      res.json(dbTransactions);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("/api/transactions", (req, res) => {
  Transactions.find({}).sort({date: -1})
    .then(dbTransactions => {
      res.json(dbTransactions);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;