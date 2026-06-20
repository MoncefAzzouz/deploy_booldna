import prisma from "../config/db.js";
import bcrypt from "bcrypt";

export async function createSuperAdmin() {
  try {
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "super_admin" },
    });

    const hashedPassword = await bcrypt.hash("testg123£", 10);
    if (!existingSuperAdmin) {
      await prisma.admin.create({
        data: {
          email: "contact@bloodna.com",
          passwordHash: hashedPassword,
          fullName: "Super",
          role: "super_admin",
          activatedAt: new Date(),
        },
      });
      console.log("✅ Super Admin created successfully");
    } else {
      console.log("✅ Super Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  }
}
