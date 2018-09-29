import * as express from "express";
import * as net from "net";
import * as https from "https";
import * as fs from "fs";

const PORT = 55381;
const CERT_PATH = `${process.env.HOME}/.certs`;
const ENCODING = "utf8";

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
    client.on("timeout", () => {
        client.end();
        res.status(500).send("TELENT SOCKET TIMEOUT\n");
    });

    client.on("data", data => {
        console.log("Response: " + data.toString());
        client.destroy();

        res.status(200).send("OK\n");
    });

    client.connect(
        23,
        "Denon-AVR.home.lasath.org",
        () => {
            const msg = `MV${targetVol}`;
            console.log(`Connected to AVR. Sending '${msg}'...`);

            client.write(msg, () => {
                console.log("Data written");
            });
        }
    );
});

const httpsServer = https.createServer(
    {
        cert: fs.readFileSync(`${CERT_PATH}/fullchain.pem`, ENCODING),
        key: fs.readFileSync(`${CERT_PATH}/privkey.pem`, ENCODING)
    },
    app
);

httpsServer.listen(PORT, () =>
    console.log(`Initialized. Listening on ${PORT}`)
);
