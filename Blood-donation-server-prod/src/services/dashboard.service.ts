/**
 * Dashboard Service
 *
 * Aggregates data from multiple tables (users, donations, blood_alerts,
 * user_blood_alert, hospitals) into a single response for the admin dashboard.
 *
 * Added because the frontend dashboard needs computed stats (eligible donors,
 * demand vs supply, alert coverage, pipeline) that don't exist in any single
 * table — this service computes them server-side to keep the frontend simple.
 */

import prisma from "../config/db.js";
import { AppError } from "../utils/error.js";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // --- KPI Cards ---
    // Run all independent count queries in parallel for performance
    const [
      totalDonors,
      regularDonors,
      verifiedDonors,
      activeAlertsCount,
      donationsThisMonth,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, isRegularDonor: true } }),
      prisma.user.count({ where: { deletedAt: null, emailVerifiedAt: { not: null } } }),
      prisma.bloodAlert.count({ where: { deletedAt: null, status: "active" } }),
      prisma.donation.count({ where: { status: "confirmed", donationDate: { gte: startOfMonth } } }),
    ]);

    // Eligible donors = verified users who have NOT donated in the last 3 months
    // Business rule: a donor can only give blood once every 3 months
    const donorsWithRecentDonation = await prisma.donation.findMany({
      where: { status: "confirmed", donationDate: { gte: threeMonthsAgo } },
      select: { userId: true },
      distinct: ["userId"],
    });
    const recentDonorIds = donorsWithRecentDonation.map((d) => d.userId);
    // notIn requires a non-empty array, so we pass [0] as fallback (no user has id=0)
    const eligibleDonors = await prisma.user.count({
      where: {
        deletedAt: null,
        emailVerifiedAt: { not: null },
        userId: { notIn: recentDonorIds.length > 0 ? recentDonorIds : [0] },
      },
    });

    // --- Blood Type Distribution ---
    // Groups donors by blood group for the donut chart
    const bloodTypeRaw = await prisma.user.groupBy({
      by: ["bloodGroup"],
      where: { deletedAt: null },
      _count: true,
    });
    const bloodTypeDistribution = bloodTypeRaw.map((b) => ({
      bloodGroup: b.bloodGroup,
      count: b._count,
    }));

    // --- Demand vs Supply per blood group ---
    // Demand = total units requested across active alerts, grouped by blood type
    // Supply = total confirmed donations for those alerts, grouped by blood type
    const alertsByBlood = await prisma.bloodAlert.groupBy({
      by: ["bloodGroup"],
      where: { deletedAt: null, status: "active" },
      _sum: { quantityUnits: true },
    });
    const confirmedByBlood = await prisma.donation.groupBy({
      by: ["alertId"],
      where: { status: "confirmed" },
      _count: true,
    });
    // Map confirmed donations back to blood groups via their parent alerts
    const activeAlerts = await prisma.bloodAlert.findMany({
      where: { deletedAt: null, status: "active" },
      select: { alertId: true, bloodGroup: true, quantityUnits: true },
    });
    const supplyByBlood: Record<string, number> = {};
    for (const alert of activeAlerts) {
      const donationCount = confirmedByBlood.find((d) => d.alertId === alert.alertId)?._count ?? 0;
      supplyByBlood[alert.bloodGroup] = (supplyByBlood[alert.bloodGroup] ?? 0) + donationCount;
    }
    const demandVsSupply = alertsByBlood.map((a) => ({
      bloodGroup: a.bloodGroup,
      demand: a._sum.quantityUnits ?? 0,
      supply: supplyByBlood[a.bloodGroup] ?? 0,
    }));

    // --- Active Alerts Coverage ---
    // Shows each active alert with its donation progress (confirmed/planned/shortage)
    // Used by the coverage table in the dashboard
    const alertsCoverage = await prisma.bloodAlert.findMany({
      where: { deletedAt: null, status: "active" },
      include: {
        hospital: { select: { name: true } },
        donations: {
          select: { status: true },
        },
      },
      orderBy: { urgencyLevel: "desc" },
    });
    const alertsCoverageData = alertsCoverage.map((a) => ({
      alertId: a.alertId,
      hospitalName: a.hospital?.name ?? null,
      bloodGroup: a.bloodGroup,
      urgencyLevel: a.urgencyLevel,
      quantityNeeded: a.quantityUnits,
      confirmed: a.donations.filter((d) => d.status === "confirmed").length,
      planned: a.donations.filter((d) => d.status === "planned").length,
      // Shortage = how many more donors are still needed
      shortage: Math.max(
        0,
        a.quantityUnits -
          a.donations.filter((d) => d.status === "confirmed").length -
          a.donations.filter((d) => d.status === "planned").length,
      ),
    }));

    // --- Donation Pipeline ---
    // Tracks conversion: notified users → accepted → planned donations → completed donations
    const [totalNotified, totalConfirmedPivot] = await Promise.all([
      prisma.userBloodAlert.count(),
      prisma.userBloodAlert.count({ where: { confirmed: true } }),
    ]);
    const plannedDonations = await prisma.donation.count({ where: { status: "planned" } });
    const confirmedDonations = await prisma.donation.count({ where: { status: "confirmed" } });

    // --- Critical Alerts ---
    // Filters for urgent alerts that still have unmet demand (shortage > 0)
    // Displayed as a red warning banner at the top of the dashboard
    const criticalAlerts = alertsCoverageData
      .filter((a) => a.urgencyLevel === "urgent" && a.shortage > 0)
      .map((a) => ({
        bloodGroup: a.bloodGroup,
        confirmed: a.confirmed,
        needed: a.quantityNeeded,
      }));

    // --- Donations over time (last 30 days) ---
    // Used for the line chart showing donation activity trends
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const donationsOverTime = await prisma.donation.findMany({
      where: { donationDate: { gte: thirtyDaysAgo } },
      select: { donationDate: true, status: true },
      orderBy: { donationDate: "asc" },
    });

    return {
      kpis: {
        totalDonors,
        regularDonors,
        eligibleDonors,
        verifiedDonors,
        activeAlerts: activeAlertsCount,
        donationsThisMonth,
      },
      bloodTypeDistribution,
      demandVsSupply,
      alertsCoverage: alertsCoverageData,
      pipeline: {
        notified: totalNotified,
        confirmed: totalConfirmedPivot,
        planned: plannedDonations,
        completed: confirmedDonations,
      },
      criticalAlerts,
      donationsOverTime: donationsOverTime.map((d) => ({
        date: d.donationDate.toISOString().split("T")[0],
        status: d.status,
      })),
    };
  } catch (error) {
    throw new AppError(`Failed to fetch dashboard stats: ${error}`, 500);
  }
}
