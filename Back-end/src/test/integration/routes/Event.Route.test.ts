import request from "supertest";
import {app }from "../../../main"; // ou vers ton express

import { Controller } from '../../../Controller/EventController';
import { eventService } from '../../../Service/EventService';
import { verifyToken } from '../../../utils/jwt';
import { userService } from '../../../Service/UserService';
jest.mock("../../../Service/EventService");
jest.mock("../../../utils/jwt");
jest.mock("../../../Service/UserService");



describe("🧪 Event routes", () => {
  const token = "validtoken";

  beforeEach(() => {
    jest.clearAllMocks();

    (verifyToken as jest.Mock).mockReturnValue({ id_user: 1 });
    (userService.findById as jest.Mock).mockResolvedValue({ token });
  });

  test("GET /api/events → retourne tous les événements", async () => {
    (eventService.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: "Event 1" },
      { id: 2, name: "Event 2" },
    ]);

    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
   expect(res.body.data).toHaveLength(2);
  });

test("POST /api/events/:id/join → rejoindre un event avec token", async () => {
  (eventService.joinEvent as jest.Mock).mockResolvedValue({ message: "Rejoint avec succès" });

  const res = await request(app)
    .post("/api/events/1/join")
    .set("Cookie", [`token=${token}`]);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toMatch(/succès/);
});

 test("POST /api/events/:id/leave → quitter un event", async () => {
  (eventService.leaveEvent as jest.Mock).mockResolvedValue({ message: "Quitté avec succès" });

  const res = await request(app)
    .post("/api/events/1/leave")
    .set("Cookie", [`token=${token}`]);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toMatch(/succès/);
});
});