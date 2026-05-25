
import express from "express"

import cron from "node-cron"



const app = express();


app.use(express.json());








const monitores = [];

app.post("/monitor", (req, res) => {

    const { url } = req.body;

  

    if (!req.body.url) {

        return res.status(400).json({ error: "URL no proporcionada" });
    }
    
    const existe = monitores.some(monitor => monitor.url === url);
     if (existe) {
        return res.status(409).json({ error: "URL ya existe!" });
    }
    
    const monitor = {
        id: monitores.length + 1,
        url: url,
        status: null
    };
    monitores.push(monitor);

    res.status(201).json({ success: true, monitor });
   });


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

