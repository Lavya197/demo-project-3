import express from "express";
import { getNotifications, getUnreadCount, markNotificationRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/mark-read", markNotificationRead);

export default router;
