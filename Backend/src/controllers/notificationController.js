const Notification = require("../models/notification.Schema");

// Recruiter ki saari notifications laane ke liye
async function getNotifications(req, res) {
    try {
        const recruiterId = req.user._id;
        const notifications = await Notification.find({ recipient: recruiterId })
            .sort({ createdAt: -1 })
            .limit(20); // Latest 20 notifications

        const unreadCount = await Notification.countDocuments({ recipient: recruiterId, isRead: false });

        res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Notification ko "Read" mark karne ke liye
async function markAsRead(req, res) {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getNotifications,
    markAsRead
};