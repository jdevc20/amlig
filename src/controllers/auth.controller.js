const passport = require("passport");

const authController = {
    login: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info.message });
            console.log("login:");
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.json({ message: "Login successful", user });
            });
        })(req, res, next);
    },

    logout: (req, res) => {
        req.logout(() => {
            res.json({ message: "Logged out successfully" });
        });
    },

    // 🔥 New /me route to check if the user is logged in
    me: (req, res) => {
        if (req.isAuthenticated()) {
            return res.json({ user: req.user });  // Return the logged-in user
        } else {
            return res.status(401).json({ message: "Not authenticated" });  // If not authenticated, return 401
        }
    },
};

module.exports = authController;
