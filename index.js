import express from "express";
import cron from "node-cron";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/monitorRoutes.js";
import Monitor from "./models/monitor.js";
import dns from "dns";
import "./cron/checkMonitores.js";
import cors from "cors";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router);

const monitoresIniciales = [
  { url: "https://www.google.com", nombre: "Google" },
  { url: "https://www.amazon.com", nombre: "Amazon" },
  { url: "https://www.facebook.com", nombre: "Facebook" },
];

async function seedDB() {
  const cantidad = await Monitor.countDocuments();
  if (cantidad === 0) {
    await Monitor.insertMany(monitoresIniciales);
    console.log("Monitores iniciales creados");
  }
}

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        throw error;
    }
};

const startServer = async () => {
    try {
        await connectDB();
        await seedDB(); // ← agregá esta línea
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor.");
        process.exit(1);
    }
};

startServer();