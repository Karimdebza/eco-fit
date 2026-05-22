import request from "supertest";
import { app } from "../../main";
import { verifyToken } from "../../utils/jwt";
import { userService } from "../../Service/UserService";

jest.mock("../../Service/UserService");
jest.mock("../../utils/jwt");

describe("🧪 Tests intégration - User Routes (MVP)", () => {
  const token = "validtoken";
   const mockUser = {
    id_user: 1,
    firstname: "Karim",
    email: "karim@mail.com",
    token: token
  };

  beforeEach(() => {
    jest.clearAllMocks();
   (verifyToken as jest.Mock).mockImplementation((token) => {
    if (token === 'validtoken') {
      return { id_user: 1 }; // Doit contenir id_user spécifiquement
    }
    throw new Error('Token invalide');
  });
    (userService.findById as jest.Mock).mockImplementation((id) => {
    return id === 1 ? Promise.resolve({
      id_user: 1,
      email: 'karim@mail.com',
      token: 'validtoken' // Doit matcher exactement le token du cookie
    }) : Promise.resolve(null);
  });
  
  });

  test("POST /api/users/register → inscrit un nouvel utilisateur", async () => {
    const newUser = { id: 1, firstname: "Karim", email: "karim@mail.com" };
    (userService.signup as jest.Mock).mockResolvedValue(newUser);

    const res = await request(app)
      .post("/api/users/register")
      .send({ firstname: "Karim", email: "karim@mail.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.firstname).toBe("Karim");
  });

   test("POST /api/users/login → connecte un utilisateur", async () => {
  // Corriger le mock pour matcher la structure réelle
  (userService.signin as jest.Mock).mockResolvedValue({
    id: 1,
    email: "karim@mail.com", // Utiliser 'email' directement
    token: "validtoken",
  });

  const res = await request(app)
    .post('/api/users/login')
    .send({ email: "karim@mail.com", password: "test" });
  
  console.log("Réponse login :", res.body);
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe("success");
  expect(res.body.user.email).toBe("karim@mail.com"); // Vérifier ici
  expect(res.headers["set-cookie"]).toBeDefined();
});

   test("POST /api/users/logout → déconnecte l'utilisateur", async () => {
    // S'assurer que le middleware trouve l'utilisateur
    (userService.updateToken as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post("/api/users/logout")
      .set("Cookie", [`token=${token}`]);
       console.log(res)
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/déconnecté/i);
  });

  test("GET /api/users/check-token → retourne les infos de l'utilisateur", async () => {
    // Utiliser le mock cohérent
    (userService.findById as jest.Mock).mockResolvedValue(mockUser);

    
    const res = await request(app)
      .get("/api/users/check-token")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("karim@mail.com");

    console.log(res)

  });

  test("GET /api/users/:id → récupère un utilisateur", async () => {
const currentUser = { id: 1, firstname: "Karim", email: "karim@mail.com", token: token };
(userService.findById as jest.Mock).mockResolvedValue(currentUser);

    const res = await request(app)
      .get("/api/users/1")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.firstname).toBe("Karim");
  });

  test("PUT /api/users/:id → modifie un utilisateur", async () => {
    const updated = { id: 1, first_name: "Karim Updated", email: "karim@mail.com" };
    (userService.update as jest.Mock).mockResolvedValue(updated);

    const res = await request(app)
      .put("/api/users/1")
      .set("Cookie", [`token=${token}`])
      .send({ first_name: "Karim Updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.first_name).toBe("Karim Updated");
  });

  test("DELETE /api/users/:id → supprime un utilisateur", async () => {
    (userService.delete as jest.Mock).mockResolvedValue({ message: "Supprimé" });

    const res = await request(app)
      .delete("/api/users/1")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });
});