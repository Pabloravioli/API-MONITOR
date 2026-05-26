
import express from "express"

import cron from "node-cron"



const app = express();


app.use(express.json());








const monitores = [];

app.post("/monitor", (req, res) => {

    const { url } = req.body;

  

    if (!url) {

        return res.status(400).json({ error: "URL no proporcionada" });
    }
    
    const existe = monitores.some(monitor => monitor.url === url);
     if (existe) {
        return res.status(409).json({ error: "URL ya existe!" });
    }
    
    const monitor = {
        id: monitores.length + 1,
        url: url,
        checks: [{
            status: null,
            checkedAt: new Date().toISOString()
        }

        ],
        
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
            monitor.checks.push({
            status: response.status,           // o -1 en el catch
            checkedAt: new Date().toISOString()});
        }
        catch (error) {
            monitor.checks.push({
                status: error.response?.status || -1,
                checkedAt: new Date().toISOString()
            });
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
            monitor.checks.push({
            status: response.status,           // o -1 en el catch
            checkedAt: new Date().toISOString()
});
            console.log({ url: monitor.url, status: response.status });
        } 
        catch (error) {
            monitor.checks.push({
                status: error.response?.status || -1,
                checkedAt: new Date().toISOString()
            });
            console.error({ url: monitor.url, status: error.response?.status || -1, error: error.message });
        }  
}});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

