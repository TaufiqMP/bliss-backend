const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/jwt");

const authUser = (req, res, next) => {
  // 1. Cek Bearer token di header (PRIORITAS UTAMA)
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  // 2. Cek token di cookies (FALLBACK)
  const cookieAccessToken = req.cookies.accessToken;
  const cookieRefreshToken = req.cookies.refreshToken;

  // 3. Gunakan Bearer token jika ada, jika tidak pakai cookies
  const accessToken = bearerToken || cookieAccessToken;
  const refreshToken = cookieRefreshToken;

  // Jika tidak ada 2-duanya → unauthorized
  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized: token tidak tersedia" });
  }

  try {
    // 1. Coba verifikasi access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();

  } catch (error) {
    // Access token expired → coba refresh
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized: token invalid" });
    }

    try {
      // 2. Verifikasi refresh token
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // 3. Generate access token baru
      const newAccessToken = generateAccessToken({
        id: decodedRefresh.id,
        email: decodedRefresh.email,
        role: decodedRefresh.role,
      });

      // 4. Set cookie token baru
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000, // 15 menit
      });

      // 5. Inject user ke request
      req.user = decodedRefresh;

      return next();

    } catch (errRefresh) {
      return res.status(401).json({ message: "Unauthorized: refresh token tidak valid" });
    }
  }
};

module.exports = authUser;
