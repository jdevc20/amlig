const User = require("../models/user.model");

const userController = {
    // Create a new user (Register)
    createUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already in use" });

            // Create new user
            const newUser = new User({ name, email, password });
            await newUser.save();

            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Get all users (excluding passwords)
    getUsers: async (req, res) => {
        try {
            const users = await User.find().select("-password");
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a user by ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update user profile (excluding password updates)
    updateUser: async (req, res) => {
        try {
            const { name, email } = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { name, email },
                { new: true }
            ).select("-password");
            if (!user) return res.status(404).json({ message: "User not found" });

            res.json({ message: "Profile updated successfully", user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a user
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;
