import express from "express"

const app = express();

app.get("/hola",(req, res)=> {
    res.send("Hola desde express!");
})

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

