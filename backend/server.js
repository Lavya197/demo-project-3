import express from "express";
import cors from "cors";

// Notice the ".js" extensions 👇
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";
import notificationRoutes from "./routes/notifications.js";
import settingsRoutes from "./routes/settings.js";
import activityRoutes from "./routes/activity.js";
import activityDashboardRoutes from "./routes/activityDashboard.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);
app.use("/settings", settingsRoutes);
app.use("/activity", activityRoutes);
app.use("/activity-dashboard", activityDashboardRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
