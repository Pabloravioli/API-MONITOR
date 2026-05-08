import express from "express"

const app = express();


app.use(express.json());

let messages = [];

app.get("/api/message", (req, res) => {
    res.json({ messages});
})

app.post("/api/message", (req, res) => {
    
    messages.push(req.body.text);
    console.log(messages)
    res.status(201).json({ success: true, message: "Recibido" });
});
const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

