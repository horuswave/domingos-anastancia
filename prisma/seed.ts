import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
async function main() {
  const superadminEmail = "andersonmacuche@gmail.com";
  const superadminPassword = "Macucha16";

  // Check if superadmin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingAdmin) {
    // Hash the password (match your app's hashing method)
    const passwordHash = await bcrypt.hash(superadminPassword, 10);

    // Create superadmin
    const superadmin = await prisma.adminUser.create({
      data: {
        email: superadminEmail,
        passwordHash: passwordHash,
        name: "Super Administrator",
        isSuperAdmin: true,
      },
    });

    console.log("Superadmin created:", superadmin.email);
  } else {
    // Optionally update existing admin to superadmin
    if (!existingAdmin.isSuperAdmin) {
      await prisma.adminUser.update({
        where: { id: existingAdmin.id },
        data: { isSuperAdmin: true },
      });
      console.log("Updated existing admin to superadmin");
    } else {
      console.log("Superadmin already exists");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
