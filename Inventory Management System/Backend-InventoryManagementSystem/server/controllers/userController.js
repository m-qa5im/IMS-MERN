// controllers/userController.js
import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing from request.",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                isAccountVerified: user.isAccountVerified,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
