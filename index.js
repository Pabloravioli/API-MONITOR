import e from "express";
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


const monitores = [
    {
        url: "https://www.google.com"
    
    },
    {
        url: "https://www.amazon.com"
    },
    {
        url: "https://www.mercadolibre.com"
    }
]


app.get("/check", async (req, res) => {
    
    if(monitores.length === 0) {
            return res.status(400).json({ error: "No monitors available" });
    }
    for (const monitor of monitores) {

        try {
            const response = await fetch(monitor.url, {method: "HEAD"});
            const status = response.status;
            monitor.status = status;
        } catch (error) {
            monitor.status = error.response?.status || -1;
        }
    
    }
    res.json(monitores);
});




cron.schedule('*/1 * * * *', async() => {
    if(monitores.length === 0) {
        console.log("No monitors available");
        return;
    }
    for (const monitor of monitores) {

        try {
            const response = await fetch(monitor.url, {method: "HEAD"});
            const status = response.status;
            monitor.status = status;
            console.log({ url: monitor.url, status: response.status });
        } 
        catch (error) {
            monitor.status = error.response?.status || -1;
            console.log({ url: monitor.url, status: monitor.status, error:error.message });
        }  
}});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

