const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const visitRoutes = require("./routes/visit.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes - mapped to /api/auth to match the frontend api.ts
app.use("/api/auth", visitRoutes);

const MONGODB_URI = "mongodb://localhost:27017/bookreader_tracking";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB at " + MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
