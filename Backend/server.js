// server.js (ESM version)
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("eCommerce API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
