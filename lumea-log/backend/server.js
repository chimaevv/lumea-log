require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const [scheme, token] = authHeader.split(" ");
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: "Bad token" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token invalid" });
    req.userId = decoded.id;
    next();
  });
}

// whoami
app.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, username: true, email: true, createdAt: true, updatedAt: true }
  });
  res.json(user);
});

// signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, email, password: hashed } });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const { password: _, ...rest } = user;
  res.json({ token, user: rest });
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "User not found" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Wrong password" });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const { password: _, ...rest } = user;
  res.json({ token, user: rest });
});

// dramas
app.get("/dramas", async (req, res) => {
  const dramas = await prisma.drama.findMany();
  res.json(dramas);
});
app.post("/dramas", authMiddleware, async (req, res) => {
  const { title, description, posterUrl } = req.body;
  const drama = await prisma.drama.create({ data: { title, description, posterUrl } });
  res.json(drama);
});
app.get("/dramas/:id", async (req, res) => {
  const drama = await prisma.drama.findUnique({ where: { id: req.params.id } });
  if (!drama) return res.status(404).json({ error: "Drama not found" });
  res.json(drama);
});

// reviews
app.get("/reviews", async (req, res) => {
  const where = req.query.dramaId ? { dramaId: req.query.dramaId } : {};
  const reviews = await prisma.review.findMany({ where, include: { user: true } });
  res.json(reviews);
});
app.post("/reviews", authMiddleware, async (req, res) => {
  const { dramaId, rating, comment } = req.body;
  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      user: { connect: { id: req.userId } },
      drama: { connect: { id: dramaId } },
    },
  });
  res.json(review);
});

// start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server 🚀 on ${PORT}`));
