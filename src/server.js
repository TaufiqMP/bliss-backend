const express = require("express");
const authRoutes = require("./api/auth/auth-routes");
const userRoutes = require("./api/users/user-routes");
const nasabahRoutes = require("./api/nasabah/nasabah-routes");
const analyticRoutes = require("./api/routes/analytic-routes");
const exportRoutes = require("./api/export/export-routes");
const leaderboardRoutes = require("./api/leaderboard/leaderboard-routes");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

app.use(cookieParser());
app.use(express.json());

app.set('trust proxy', 1);

app.use(cors({ origin: 'https://bliss-frontend-opal.vercel.app', credentials: true }));


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/nasabah", nasabahRoutes);
app.use("/analytic", analyticRoutes);
app.use("/export", exportRoutes);
app.use("/leaderboard", leaderboardRoutes);


app.listen(3000, () => {
    console.log("Server running on port 3000");
});



