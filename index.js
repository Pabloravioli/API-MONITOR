
import express from "express"
import cron from "node-cron"
import dotenv from "dotenv"
import mongoose from "mongoose"
import router from "./routes/monitorRoutes.js"
import dns from "dns";
import "./cron/checkMonitores.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI), 
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }};

connectDB();




const app = express();
app.use(express.json());

app.use(router);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));

