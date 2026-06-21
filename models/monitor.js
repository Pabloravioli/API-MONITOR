import mongoose from "mongoose";

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


export default Monitor;