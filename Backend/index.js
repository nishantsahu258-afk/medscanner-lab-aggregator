const express = require("express");
const app = express();
const cors = require("cors")
const searchRouter = require("./routes/search")
const PORT = process.env.PORT || 8010;

app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders: ["Content-Type"]
}))



app.use("/api",searchRouter)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
