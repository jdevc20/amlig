const passport = require("passport");

const authController = {
    login: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info.message });

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
    }
};

module.exports = authController;
