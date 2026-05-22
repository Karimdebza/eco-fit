import { Request, Response } from 'express';
import { userController } from '../../Controller/UserController';
import { userService } from '../../Service/UserService';

jest.mock('../../Service/UserService');
interface UserRequest extends Request {
  user?: {
    id: number;
    role?: string;
  };
}

describe('UserController', () => {
  let req: Partial<UserRequest>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let clearCookieMock: jest.Mock;
  let cookieMock: jest.Mock;
  let nextMock: jest.Mock;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, cookies: {}, headers: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    clearCookieMock = jest.fn();
    cookieMock = jest.fn();
    nextMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
      clearCookie: clearCookieMock,
      cookie: cookieMock,
    };

    jest.clearAllMocks();
  });

  it('doit retourner une erreur si le mail est manquant', async () => {
    req.query = {};
    await userController.findByEmail(req as UserRequest, res as Response, jest.fn());

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Email requis' });
  });

  it('doit retourner une erreur si un utilisateur n est pas trouvé', async () => {
    req.query = { email: 'notfound@example.com' };
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);

    await userController.findByEmail(req as UserRequest, res as Response, jest.fn());

    expect(userService.findByEmail).toHaveBeenCalledWith('notfound@example.com');
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Utilisateur non trouvé' });
  });

  it('doit retourner les données de l utilisateur', async () => {
    const fakeUser = { id_user: 1, email: 'found@example.com' };
    req.query = { email: 'found@example.com' };
    (userService.findByEmail as jest.Mock).mockResolvedValue(fakeUser);

    await userController.findByEmail(req as UserRequest, res as Response, jest.fn());

    expect(userService.findByEmail).toHaveBeenCalledWith('found@example.com');
    expect(jsonMock).toHaveBeenCalledWith({ status: 'success', data: fakeUser });
  });

  describe('searchByName', () => {
    it('doit retourner une erreur si le nom est manquant', async () => {
      req.query = {};
      await userController.searchByName(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Nom requis' });
    });

    it('doit retourner une erreur si aucun utilisateur n est trouvé', async () => {
      req.query = { name: 'Nobody' };
      (userService.searchByName as jest.Mock).mockResolvedValue([]);

      await userController.searchByName(req as UserRequest, res as Response, nextMock);

      expect(userService.searchByName).toHaveBeenCalledWith('Nobody');
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'error',
        message: 'Aucun utilisateur trouvé avec ce nom',
      });
    });

    it('doit retourner les utilisateurs trouvés', async () => {
      const users = [{ id_user: 1, first_name: 'John' }];
      req.query = { name: 'John' };
      (userService.searchByName as jest.Mock).mockResolvedValue(users);

      await userController.searchByName(req as UserRequest, res as Response, nextMock);

      expect(userService.searchByName).toHaveBeenCalledWith('John');
      expect(jsonMock).toHaveBeenCalledWith({ status: 'success', data: users });
    });
  });

  describe('getMe', () => {
    it('doit retourner une erreur 401 si l utilisateur n est pas authentifié', async () => {
      req = {};
      await userController.getMe(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Utilisateur non authentifié' });
    });

    it('doit retourner une erreur 404 si l utilisateur n est pas trouvé', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);
      req = { user: { id: 42 } };

      await userController.getMe(req as UserRequest, res as Response, nextMock);

      expect(userService.getUserById).toHaveBeenCalledWith(42);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Utilisateur non trouvé' });
    });

    it('doit retourner les données de l utilisateur s il est trouvé', async () => {
      const user = { id_user: 1, email: 'user@example.com' };
      (userService.getUserById as jest.Mock).mockResolvedValue(user);
      req = { user: { id: 1 } };

      await userController.getMe(req as UserRequest, res as Response, nextMock);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'success', data: user });
    });
  });

  describe('disableUser', () => {
    it('doit retourner une erreur si is_disabled est manquant', async () => {
      req.params = { id_user: '1' };
      req.body = {};
      await userController.disableUser(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'is_disabled requis' });
    });

    it('doit mettre à jour le statut is_disabled de l utilisateur', async () => {
      const updatedUser = { id_user: 1, is_disabled: true };
      req.params = { id_user: '1' };
      req.body = { is_disabled: true };
      (userService.toggleUserDisabled as jest.Mock).mockResolvedValue(updatedUser);

      await userController.disableUser(req as UserRequest, res as Response, nextMock);

      expect(userService.toggleUserDisabled).toHaveBeenCalledWith(1, true);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        message: 'Utilisateur mis à jour',
        data: updatedUser,
      });
    });
  });

  describe('updatePassword', () => {
    it('doit retourner une erreur si le nouveau mot de passe est manquant', async () => {
      req.params = { id_user: '1' };
      req.body = {};
      await userController.updatePassword(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Nouveau mot de passe requis' });
    });

    it('doit mettre à jour le mot de passe', async () => {
      const user = { id_user: 1 };
      req.params = { id_user: '1' };
      req.body = { newPassword: 'newpass123' };
      (userService.updatePassword as jest.Mock).mockResolvedValue(user);

      await userController.updatePassword(req as UserRequest, res as Response, nextMock);

      expect(userService.updatePassword).toHaveBeenCalledWith(1, 'newpass123');
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        message: 'Mot de passe mis à jour',
        data: user,
      });
    });
  });

  describe('updateProfilePicture', () => {
    it('doit retourner une erreur si l URL de la photo de profil est manquante', async () => {
      req.params = { id_user: '1' };
      req.body = {};
      await userController.updateProfilePicture(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'URL de la photo de profil requise' });
    });

    it('doit mettre à jour la photo de profil', async () => {
      const user = { id_user: 1, picture: 'newpic.jpg' };
      req.params = { id_user: '1' };
      req.body = { pictureUrl: 'newpic.jpg' };
      (userService.updateProfilePicture as jest.Mock).mockResolvedValue(user);

      await userController.updateProfilePicture(req as UserRequest, res as Response, nextMock);

      expect(userService.updateProfilePicture).toHaveBeenCalledWith(1, 'newpic.jpg');
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'success',
        message: 'Photo de profil mise à jour',
        data: user,
      });
    });
  });

  describe('signup', () => {
    it('doit créer un utilisateur', async () => {
      const user = { id_user: 1, email: 'test@example.com' };
      req.body = { email: 'test@example.com', password: 'password123' };
      (userService.signup as jest.Mock).mockResolvedValue(user);

      await userController.signup(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'success', data: user });
    });

    it('doit retourner une erreur en cas d échec', async () => {
      req.body = { email: 'test@example.com' };
      (userService.signup as jest.Mock).mockRejectedValue(new Error('Erreur signup'));

      await userController.signup(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Erreur signup' });
    });
  });

  describe('signin', () => {
    it('doit connecter un utilisateur et attribuer un cookie', async () => {
      const signinResult = { id: 1, email: 'test@example.com', token: 'jwt-token' };
      req.body = { email: 'test@example.com', password: 'password123' };
      (userService.signin as jest.Mock).mockResolvedValue(signinResult);

      await userController.signin(req as UserRequest, res as Response, nextMock);

      expect(userService.signin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(cookieMock).toHaveBeenCalledWith('token', 'jwt-token', expect.any(Object));
      expect(jsonMock).toHaveBeenCalledWith({
        status: "success",
        message: 'Connexion réussie',
        user: { id: 1, email: 'test@example.com' },
      });
    });

    it('doit retourner une erreur en cas d échec de connexion', async () => {
      req.body = { email: 'test@example.com', password: 'wrong' };
      (userService.signin as jest.Mock).mockRejectedValue(new Error('Mot de passe incorrect'));

      await userController.signin(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Mot de passe incorrect' });
    });
  });

  describe('logOut', () => {
    it('doit retourner une erreur si l utilisateur n est pas authentifié', async () => {
      req = {};
      await userController.logOut(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Utilisateur non authentifié' });
    });

    it('doit effacer le cookie et retourner un succès', async () => {
      req = { user: { id: 1 } };
      (userService.logout as jest.Mock).mockResolvedValue({ success: true });

      await userController.logOut(req as UserRequest, res as Response, nextMock);

      expect(userService.logout).toHaveBeenCalledWith(1);
      expect(clearCookieMock).toHaveBeenCalledWith('token', expect.any(Object));
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Déconnexion réussie', data: { success: true } });
    });

    it('doit retourner une erreur 400 en cas d échec de déconnexion', async () => {
      req = { user: { id: 1 } };
      (userService.logout as jest.Mock).mockRejectedValue(new Error('Erreur logout'));

      await userController.logOut(req as UserRequest, res as Response, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'error', message: 'Erreur logout' });
    });
  });
});
