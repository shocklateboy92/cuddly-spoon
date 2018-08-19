"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const PORT = 55381;
const app = express();
app.get("/avr/volume", (req, res) => {
    console.log("Doing a thing");
    res.status(200).send("OK");
});
app.listen(PORT, () => console.log(`Initialized. Listening on ${PORT}`));
