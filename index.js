import express from "express"

const app = express();

app.get("/hola",(req, res)=> {
    res.send("Hola desde express!");
})

app.use(express.static("urls"));

app.get("/api/data", (req, res) => {

    res.json({ message: "https://www.google.com.ar" })
});

let message = [];

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

