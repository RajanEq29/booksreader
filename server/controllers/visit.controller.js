const UserVisit = require("../models/visit.schema");

exports.createVisit = async (req, res) => {
    try {
        const { name, phone, email, message, visits, totalTimeSpent } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone is required",
            });
        }

        // Check if user already exists
        let user = await UserVisit.findOne({ phone });

        // Filter out visits with 0 duration to save meaningful data only
        const meaningfulVisits = (visits || []).filter(v => v.duration > 0);
        const meaningfulTime = meaningfulVisits.reduce((acc, v) => acc + (v.duration || 0), 0);

        if (user) {
            // Update existing user with new visits if provided
            if (meaningfulVisits.length > 0) {
                user.visits.push(...meaningfulVisits);
                user.totalTimeSpent += meaningfulTime;
            }
            // Optionally update name/email/message if they are provided
            if (name) user.name = name;
            if (email) user.email = email;
            if (message) user.message = message;

            await user.save();
        } else {
            // Create new user
            user = new UserVisit({
                name: name || "Anonymous",
                phone,
                email,
                message,
                visits: meaningfulVisits,
                totalTimeSpent: meaningfulTime,
            });
            await user.save();
        }

        res.status(201).json({
            success: true,
            message: user.isNew ? "Visit data saved successfully" : "Visit added to existing user",
            data: user,
        });

    } catch (error) {
        console.error("Error in createVisit:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

exports.getAllVisits = async (req, res) => {
    try {
        const data = await UserVisit.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching visits",
        });
    }
};

exports.getSingleVisit = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserVisit.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            analytics: {
                totalVisits: user.visits.length,
                totalTimeSpent: user.totalTimeSpent
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user data",
        });
    }
};

exports.addVisitToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const incomingVisit = req.body;

        const user = await UserVisit.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find if the last visit is the same one (same ID and path)
        const lastVisit = user.visits.length > 0 ? user.visits[user.visits.length - 1] : null;

        if (lastVisit && lastVisit.id === incomingVisit.id && lastVisit.path === incomingVisit.path) {
            // Update existing visit
            const oldDuration = lastVisit.duration || 0;
            lastVisit.duration = incomingVisit.duration || 0;

            // Update page visits
            if (incomingVisit.pageVisits) {
                lastVisit.pageVisits = incomingVisit.pageVisits;
            }

            // Update total time: add the difference
            user.totalTimeSpent += (lastVisit.duration - oldDuration);
        } else {
            // Add new visit
            user.visits.push(incomingVisit);
            user.totalTimeSpent += incomingVisit.duration || 0;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Visit synchronized successfully",
            data: user,
        });

    } catch (error) {
        console.error("Error in addVisitToUser:", error);
        res.status(500).json({
            success: false,
            message: "Error synchronizing visit",
        });
    }
};

exports.deleteVisit = async (req, res) => {
    try {
        const { id } = req.params;
        await UserVisit.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting data",
        });
    }
};
