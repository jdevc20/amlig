const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"] // Ensures valid email
        },
        password: {
            type: String,
            required: true,
            minlength: 6 // Enforce minimum password length
        }
    },
    { timestamps: true } // Adds createdAt & updatedAt fields automatically
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12); // Increased salt rounds for stronger security
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
