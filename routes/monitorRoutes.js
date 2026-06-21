import express from "express";
import Monitor from "../models/monitor.js";

import { calcularMetricas } from "../utils/metrics.js";
import { checkMonitores } from "../cron/checkMonitores.js"; 

const router = express.Router()



router.post("/monitor",async (req, res) => {

    

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


router.get("/monitor",async (req, res) => {
    try {
        const monitor = await Monitor.find();
        res.json({ monitors: monitor });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener monitores" });
    }
});


router.get("/monitor/summary", async (req, res) => {
    try {
        const monitores = await Monitor.find();
        const summary = monitores.map(monitor => {
            return calcularMetricas(monitor);
        });
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener resumen de monitores" });
    }
});

router.get("/monitor/:id", async (req, res) => {
    try {
        const monitor = await Monitor.findById(req.params.id);
        if (!monitor) {
            return res.status(404).json({ error: "Monitor no encontrado" });
        }
        const metrics = calcularMetricas(monitor);
        

        res.json({ monitor: metrics });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener monitor" });
    }
});

router.delete("/monitor/:id", async (req, res) => {
    try {
        const monitor = await Monitor.findByIdAndDelete(req.params.id);
        if (!monitor) {
            return res.status(404).json({ error: "Monitor no encontrado" });
        }
        res.json({ message: "Monitor eliminado", monitor });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar monitor" });
    }
});

router.put("/monitor/:id", async (req, res) => {
    try {
        const existe = await Monitor.findOne({url: req.body.url});
        if (existe) {
            return res.status(409).json({ error: "URL ya existe!" });
        }
        if (!req.body.url) {
            return res.status(400).json({ error: "URL no proporcionada" });
        }
        const monitor = await Monitor.findByIdAndUpdate(req.params.id,{ url: req.body.url }, { new: true });
        if (!monitor) {
            return res.status(404).json({ error: "Monitor no encontrado" });
        }
        res.json({ message: "Monitor actualizado", monitor });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar monitor" });
    }
});

router.get("/check", async (req, res) => {
    await checkMonitores();
    const monitores = await Monitor.find();
    res.json({ monitors: monitores });
    
});


export default router;