
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



app.post("/monitor",async (req, res) => {

    

    if (!req.body.url) {

        return res.status(400).json({ error: "URL no proporcionada" });
    }
    
    const existe = await Monitor.findOne({url: req.body.url});
     if (existe) {
        return res.status(409).json({ error: "URL ya existe!" });
    }

    const monitor = new Monitor({
        url: req.body.url,
        checks: []
    });
    await monitor.save();

    res.status(201).json({ message: "Monitor agregado", monitor });
   });



app.get("/monitor",async (req, res) => {
    try {
        const monitor = await Monitor.find();
        res.json({ monitors: monitor });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener monitores" });
    }
});

async function checkMonitores() {
    try {
        const monitores = await Monitor.find();
        for (const monitor of monitores) {
        try {
            const tiempo = Date.now();
            const response = await fetch(monitor.url);
            
            await Monitor.updateOne(
            { _id: monitor._id },
            { $push: {
                checks: {
                    status: response.status,
                    responseTime: Date.now() - tiempo,
                    checkedAt: new Date().toISOString()
                }
            }} );
        }catch (error) {
            await Monitor.updateOne(
                { _id: monitor._id },
                { $push: {
                    checks: {
                        status: -1,
                        responseTime: -1,
                        checkedAt: new Date().toISOString()
                    }
                }});
        }}
    }catch (error) {
        console.error("Error al verificar monitores:", error);

    }
};


app.get("/monitor/summary", async (req, res) => {
    try {
        const monitores = await Monitor.find();
        const summary = monitores.map(monitor => {
            const totalChecks = monitor.checks.length;
            const successfulChecks = monitor.checks.filter(check => check.status >= 200 && check.status < 400);
            const cantidadExitosa = successfulChecks.length;
            const lastCheck = monitor.checks.length > 0 ? monitor.checks[monitor.checks.length - 1] : null;
            const uptimePercentage = totalChecks > 0 ? (cantidadExitosa /totalChecks ) * 100 : 0;
            const averageResponseTime = cantidadExitosa > 0 ? successfulChecks.reduce((acc, check) => acc + check.responseTime, 0) / cantidadExitosa : 0;
            return {
                url: monitor.url,
                lastStatus: lastCheck ? lastCheck.status : "N/A",
                lastResponseTime: lastCheck ? lastCheck.responseTime : "N/A",
                totalChecks,
                successfulChecks: cantidadExitosa,
                uptimePercentage,
                averageResponseTime
            };
        });
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener resumen de monitores" });
    }
});

app.get("/check", async (req, res) => {
    await checkMonitores();
    const monitores = await Monitor.find();
    res.json({ monitors: monitores });
    
});

cron.schedule('*/1 * * * *', async() => {

    await checkMonitores();
});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

