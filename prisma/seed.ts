import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getChecklistForCity } from "../lib/adapters/checklist-templates";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const staffPasswordHash = await bcrypt.hash("password123", 10);
  const clientPasswordHash = await bcrypt.hash("password123", 10);

  const staff = await prisma.user.upsert({
    where: { email: "staff@andalus.et" },
    update: {},
    create: {
      role: "STAFF",
      name: "Selam Tesfaye",
      email: "staff@andalus.et",
      passwordHash: staffPasswordHash,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@andalus.et" },
    update: {},
    create: {
      role: "CLIENT",
      name: "Abel Girma",
      email: "client@andalus.et",
      passwordHash: clientPasswordHash,
      inviteStatus: "ACCEPTED",
      invitedById: staff.id,
      invitedAt: new Date(),
    },
  });

  const midProject = await prisma.project.create({
    data: {
      clientId: client.id,
      staffId: staff.id,
      stage: "DESIGN",
      city: "Addis Ababa",
      title: "Bole Residence — Private Villa",
      contactName: client.name,
      contactEmail: client.email,
      contactPhone: "+251911223344",
      notes: "Client prefers minimalist facade. Budget confirmed at 4.5M ETB.",
    },
  });

  const leadProject = await prisma.project.create({
    data: {
      clientId: null,
      staffId: null,
      stage: "LEAD",
      city: "Adama",
      title: "Inquiry — Fresh Lead",
      contactName: "Hanna Bekele",
      contactEmail: "hanna.bekele@example.com",
      contactPhone: "+251922334455",
      notes: "Submitted via public contact form. Interested in a small commercial building.",
    },
  });

  const completedProject = await prisma.project.upsert({
    where: { id: "abdu-residence-seed" },
    update: {},
    create: {
      id: "abdu-residence-seed",
      clientId: null,
      staffId: staff.id,
      stage: "COMPLETE",
      city: "Addis Ababa",
      title: "Abdu Residence — Private Villa",
      coverImageUrl: "/projects/abdu-residence/hero.jpg",
      galleryImageUrls: [
        "/projects/abdu-residence/hero.jpg",
        "/projects/abdu-residence/exterior-2.jpg",
        "/projects/abdu-residence/facade-detail.jpg",
        "/projects/abdu-residence/aerial.jpg",
      ],
    },
  });

  await prisma.document.createMany({
    data: [
      {
        projectId: midProject.id,
        type: "Site Survey",
        version: 1,
        status: "VERIFIED",
        fileName: "site-survey-v1.pdf",
        storageKey: "seed/site-survey-v1.pdf",
        uploadedById: staff.id,
        verifiedById: staff.id,
      },
      {
        projectId: midProject.id,
        type: "Design Concept",
        version: 2,
        status: "PENDING",
        fileName: "design-concept-v2.pdf",
        storageKey: "seed/design-concept-v2.pdf",
        uploadedById: staff.id,
      },
    ],
  });

  await prisma.invoice.create({
    data: {
      projectId: midProject.id,
      amountEtb: 450000,
      status: "PENDING",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.invoice.create({
    data: {
      projectId: midProject.id,
      amountEtb: 250000,
      status: "VERIFIED",
      dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      paymentMethod: "telebirr",
      verifiedById: staff.id,
    },
  });

  await prisma.task.create({
    data: {
      projectId: midProject.id,
      assigneeId: client.id,
      title: "Client design sign-off",
      type: "GENERAL",
      status: "OPEN",
      approvalStatus: "PENDING_CLIENT",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const kiremtStart = new Date(new Date().getFullYear(), 5, 15); // Jun 15
  const kiremtEnd = new Date(new Date().getFullYear(), 6, 30); // Jul 30

  const permitTask = await prisma.task.create({
    data: {
      projectId: midProject.id,
      assigneeId: staff.id,
      title: "MoUDI Submission",
      type: "PERMIT",
      status: "IN_PROGRESS",
      startDate: kiremtStart,
      dueDate: kiremtEnd,
    },
  });

  const checklistItems = getChecklistForCity(midProject.city);
  await prisma.taskChecklistItem.createMany({
    data: checklistItems.map((item, index) => ({
      taskId: permitTask.id,
      label: item.label,
      required: item.required,
      done: index < 2,
      completedAt: index < 2 ? new Date() : null,
      completedById: index < 2 ? staff.id : null,
      sortOrder: index,
    })),
  });

  await prisma.message.createMany({
    data: [
      {
        projectId: midProject.id,
        senderId: staff.id,
        body: "Hi Abel, the design concept v2 is ready for your review.",
      },
      {
        projectId: midProject.id,
        senderId: client.id,
        body: "Thanks, taking a look now.",
      },
      {
        projectId: midProject.id,
        senderId: staff.id,
        body: "Let us know if you'd like any changes to the facade.",
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`  staff:  staff@andalus.et / password123`);
  console.log(`  client: client@andalus.et / password123`);
  console.log(`  mid-pipeline project: ${midProject.id} (${midProject.title})`);
  console.log(`  fresh lead: ${leadProject.id} (${leadProject.title})`);
  console.log(`  completed (public) project: ${completedProject.id} (${completedProject.title})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
