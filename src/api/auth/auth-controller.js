const AuthService = require("../../services/auth-service")

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const user = await AuthService.register(email, username, password);

    res.status(201).json({ status: 'success', data: user });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message || 'Internal server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.login(email, password);

    // Set refresh token (HttpOnly)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,          // ganti true kalau HTTPS
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    // OPTIONAL: bisa juga kirim access token sebagai cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 15 * 60 * 1000 // 15 menit
    });

    // accessToken boleh dikirim via JSON
    res.json({
      success: true,
      accessToken
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const newAccess = await AuthService.refreshAccessToken(refreshToken);

    res.json({ success: true, accessToken: newAccess });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await AuthService.logout(refreshToken);


    res.clearCookie("accessToken", {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/"
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.verify = (req, res) => {
  res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
};

