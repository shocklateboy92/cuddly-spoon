import * as express from "express";
import * as net from "net";

const PORT = 55381;
const DEFAULT_VOLUME = 30;

const app = express();

app.get("/avr/volume", (req, res) => {
    const queryVol = parseInt(req.query["number"]);

    if (req.query["key"] !== "Key1" || !queryVol || queryVol >= 1000) {
        res.status(400).send("BAD REQUEST\n");
        return;
    }

    const targetVol = queryVol < 10 ? queryVol * 10 : queryVol;

    console.log(`Setting avr volume to ${targetVol}`);

    const client = new net.Socket();

    client.setTimeout(2000);
    client.on('timeout', () => {
        client.end();
        res.status(500).send('TELENT SOCKET TIMEOUT');
    })

    client.on("data", data => {
        console.log('Response: ' + data.toString());
        client.destroy();

        res.status(200).send("OK\n");
    });

    client.connect(
        23,
        "Denon-AVR-S940H.home.lasath.org",
        () => {
            const msg = `MV${targetVol}`;
            console.log(`Connected to AVR. Sending '${msg}'...`);

            client.write(msg, () => {
                console.log('Data written');
            });
        }
    );
});

app.listen(PORT, () => console.log(`Initialized. Listening on ${PORT}`));
