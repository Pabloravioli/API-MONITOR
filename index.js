import express from "express"

import cron from "node-cron"



const app = express();


app.use(express.json());



let messages = [];

app.get("/api/message", (req, res) => {
    res.json({ messages});
})

app.post("/api/message", (req, res) => {
    
    messages.push(req.body.text);
    console.log(messages)
    res.status(201).json({ success: true, message: "Recibido" });
});

const monitorUrl = "https://www.google.com";

app.get("/check", async (req, res) => {

    const url = req.query.url

    if(!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await fetch(url, {method: "HEAD"});
        const status = response.status;
        res.json({ url, status });
    } catch (error) {
        res.status(500).json({url, error: "Failed to check URL" });
    }
});




cron.schedule('*/1 * * * *', async() => {
    try {
        const response = await fetch(monitorUrl, { method: "HEAD" });
        console.log({ url: monitorUrl, status: response.status });
    } catch (error) {
        console.error({ url: monitorUrl, error: "Failed to check URL" });
    }
});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

