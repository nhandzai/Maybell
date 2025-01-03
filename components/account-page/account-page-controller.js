const { renderAccountPage, renderProfileInformation, renderManageAddress, renderChangePassword, renderMyOrderHistory, renderOrderOverview } = require("./account-page-view")
const { fetchUserById, updateUserAddress, updateUserInfo, updateUserPassword, comparePassword,fetchOrderByUser,fetchDetailOrder } = require("./account-page-model")

const getAccountPage = async (req, res) => {
    const user = await fetchUserById(req.user.id);
    renderAccountPage(req, res, user);
};

const getProfileInformation = async (req, res) => {
    const user = await fetchUserById(req.user.id);
    renderProfileInformation(req, res, user);
};

const getManageAddress = async (req, res) => {
    const user = await fetchUserById(req.user.id);
    renderManageAddress(req, res,user);
};

const getChangePassword = (req, res) => {
    renderChangePassword(req, res);
};

const getMyOrderHistory = async (req, res) => {
    const order = await fetchOrderByUser(req.user.id);
 
    renderMyOrderHistory(req, res,order);
};

const getOrderOverview = async (req, res) => {
    
    const orderId = req.query.id;
    const order= await fetchDetailOrder(orderId,req.user.id);
    console.log('order---', JSON.stringify(order) );
    renderOrderOverview(req, res,order);
};

async function updateInfo(req, res) {
    const { fullName, sex, phone, bio } = req.body;
    const avatar = req.file; 

    const userId = req.user.id;

    console.log('avatar', avatar); 

    try {
        const result = await updateUserInfo(userId, fullName, sex, phone, bio, avatar);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
}



async function updateAddress(req, res) {
    const { country, city } = req.body;
    const userId = req.user.id;
    try {
        await updateUserAddress(userId, country, city);
        res.json({ message: "User address updated successfully!" });
    } catch (error) {
        res.json({ message: "An error occurred while updating user address." });
    }
}


async function changePassword(req, res) {

    const { oldPassword, newPassword, repeatNewPassword } = req.body;

    const userId = req.user.id;
    try {
        const user = await fetchUserById(userId);
        const isPasswordCorrect = await comparePassword(oldPassword, userId);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password is incorrect." });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from old password." });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters long." });
        }
        if (newPassword !== repeatNewPassword) {
            return res.status(400).json({ message: "New password and repeat new password do not match." });
        }
        await updateUserPassword(userId, newPassword);
        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while changing password." });
    }
}


module.exports = {
    getAccountPage, getProfileInformation, getManageAddress, getChangePassword, updateInfo, updateAddress, changePassword, getMyOrderHistory, getOrderOverview
};  