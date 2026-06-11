
import express from "express"

import cron from "node-cron"

const mongoose = require('mongoose');
const db_host = 127.0.0.1.27017;
const db.url = `mongodb://${db_host}/monitoring`;


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
        checks: [],
        
    };
    monitores.push(monitor);

    res.status(201).json({ message: "Monitor agregado", monitor });
   });



app.get("/monitors", (req, res) => {

    res.json({ monitors: monitores });
});

async function checkMonitores(monitores) {
    
    if(monitores.length === 0) {

        console.log("No hay monitores para verificar.");
        return;
           
    }
    for (const monitor of monitores) {

        const tiempo = Date.now();

        try {
            const response = await fetch(monitor.url, {method: "HEAD"});
            const tiempoRespuesta = Date.now() - tiempo;
            monitor.checks.push({
                status: response.status,           // o -1 en el catch
                checkedAt: new Date().toISOString(),
                responseTime: tiempoRespuesta
        });
            
        }
        catch (error) {
            monitor.checks.push({
                status:-1,
                checkedAt: new Date().toISOString(),
                responseTime: null
            });
        }
    
    }
};


app.get("/check", async (req, res) => {
    await checkMonitores(monitores);
    res.json({ monitors: monitores });
    
});

cron.schedule('*/1 * * * *', async() => {

    await checkMonitores(monitores);
});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

