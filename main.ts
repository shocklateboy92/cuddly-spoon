import express from 'express';

const PORT = 3000;

const app = express();

app.get("/avr/volume", (req, res) => {
    console.log("Doing a thing");

    res.status(200).send("OK");
});

app.listen(PORT, () => console.log(`Initialized. Listening on ${PORT}`));
