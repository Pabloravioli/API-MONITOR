
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

async function checkUrl(monitores) {
    
    if(monitores.length === 0) {

        console.log("No hay monitores para verificar.");
        return;
           
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
};


app.get("/check", async (req, res) => {
    await checkUrl(monitores);
    res.json({ monitors: monitores });
});

cron.schedule('*/1 * * * *', async() => {

    await checkUrl(monitores);
});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

