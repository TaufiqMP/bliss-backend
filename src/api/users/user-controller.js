const UsersService = require("../../services/user-service")
const StorageService = require("../../services/storage-service")

exports.getSales = async (req, res, next) => {
    try {
        const users = await UsersService.getSales();
        return res.status(200).send({
            status: 'success',
            data: {
                users,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsersById = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        console.log(`user id:`, req.user);
        console.log(`role_id:`, req.user.role_id);
        if (req.user.role_id == 2) {
            if (req.user.user_id != parseInt(user_id)) {
                return res.status(403).json({
                    status: "fail",
                    message: "Forbidden: Anda tidak boleh mengakses data user lain"
                });
            }
        }
        const user = await UsersService.getUserById(user_id);
        return res.status(200).send({
            status: 'success',
            data: { user },
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message || "Internal server error"
        });
    }
};


exports.putUsersById = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const payload = req.body;
        console.log(payload);
        console.log(user_id);
        const userUpdate = await UsersService.putUserById(payload, user_id);
        return res.status(200).send({
            status: 'success',
            data: {
                userUpdate,
            },
        });
    } catch (error) {
        next(error)
    }
}

exports.deleteUsersById = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        await StorageService.deleteFolder(user_id);
        await UsersService.deleteUserById(user_id);
        return res.status(200).send({
            status: 'success',
        });
    } catch (error) {
        next(error)
    }
}

exports.uploadProfile = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                status: 'fail',
                message: 'No file uploaded',
            });
        }
        const imageUrl = await StorageService.uploadProfile({ file, userId: user_id });
        await UsersService.putUserById({ image_url: imageUrl }, user_id);
        return res.status(200).json({
            status: 'success',
            data: {
                imageUrl,
            },
        });
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getTopThree = async (req, res) => {
  try {
    const data = await UsersService.getTopThreeUsers();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
    try {
        const {userId, username, phone_number, address} = req.body;

        const updatedUser = await UsersService.updateUserProfile({userId, username, phone_number, address});

        res.json({
            status: "success",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

