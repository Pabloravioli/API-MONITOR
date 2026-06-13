
import express from "express"
import cron from "node-cron"
import dotenv from "dotenv"
import mongoose from "mongoose"

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();


const app = express();
app.use(express.json());


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI), 
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }};

connectDB();

const monitorSchema = new mongoose.Schema({
    
    url: String,
    checks: [
        {
            status: Number,
            responseTime: Number,
            checkedAt: Date
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Monitor = mongoose.model("Monitor", monitorSchema);

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

