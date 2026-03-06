const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    path: { type: String, required: true },
    duration: { type: Number, default: 0 },
    pageVisits: { type: Map, of: Number }
});

const UserVisitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    message: { type: String },
    visits: [VisitSchema],
    totalTimeSpent: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model("UserVisit", UserVisitSchema);
