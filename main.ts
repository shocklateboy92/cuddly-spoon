import * as express from 'express';

const PORT = 55381;
const DEFAULT_VOLUME = 30;

const app = express();

app.get("/avr/volume", (req, res) => {
    if (req.query['key'] !== 'Key1') {
        res.status(400).send('BAD REQUEST\n');
        return;
    }

    // console.log(JSON.stringify(req.query, null, 4));
    console.log(`Setting avr volume to ${req.query['number'] || DEFAULT_VOLUME}`);

    

    res.status(200).send("OK\n");
});

app.listen(PORT, () => console.log(`Initialized. Listening on ${PORT}`));
