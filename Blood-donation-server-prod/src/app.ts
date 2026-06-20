import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import hospitalRoutes from "./routers/hospital.route.js";
import adminCtsRoutes from "./routers/adminCts.route.js";
import donationRoutes from "./routers/donation.route.js";
import userRoutes from "./routers/user.route.js";
import alertRoutes from "./routers/alert.route.js";
import notificationRoutes from "./routers/notification.route.js";
import questionRoutes from "./routers/question.route.js";
import { createSuperAdmin } from "./utils/initAdmin.js";
import dashboardRoutes from "./routers/dashboard.route.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: false,
  }),
);

app.use(express.json());

app.use("/api/v1", hospitalRoutes);
app.use("/api/v1", adminCtsRoutes);
app.use("/api/v1", donationRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", alertRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", dashboardRoutes); // Added: GET /api/v1/dashboard/stats

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

async function start_server() {
  await createSuperAdmin();
  const PORT = env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode.`);
  });
}
start_server();
