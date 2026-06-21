import cron from "node-cron";
import Monitor from "../models/monitor.js";



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

cron.schedule('*/1 * * * *', async() => {

    await checkMonitores();
});

export { checkMonitores };