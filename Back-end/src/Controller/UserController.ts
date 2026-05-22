import { Request, Response } from 'express';

import asyncHandler from '../utils/asyncHandler';
import BaseController from './BaseController';
import { userService } from '../Service/UserService';
import db from '../Model';

export class UserController extends BaseController<typeof db.User> {

  constructor() {
    super(userService, 'Utilisateur');
  }

  async findByEmail(req: Request, res: Response){
   
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email requis' });
    }

    const user = await userService.findByEmail(String(email));
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Utilisateur non trouvé' });
    }

    res.json({ status: 'success', data: user });
  }

  async searchByName(req: Request, res: Response) {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Nom requis' });
    }

    const results = await userService.searchByName(String(name));
    if (results.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun utilisateur trouvé avec ce nom',
      });
    }

    res.json({ status: 'success', data: results });
  }

  async getMe(req: Request, res: Response) {
  try {
    // req.user doit contenir l'id de l'utilisateur, injecté par authMiddleware
    const userPayload = (req as any).user;
    if (!userPayload?.id) {
      return res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
    }

    const user = await userService.getUserById(userPayload.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Utilisateur non trouvé' });
    }

    res.json({ status: 'success', data: user });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

  async disableUser(req: Request, res: Response) {
    const { id_user } = req.params;
    const { is_disabled } = req.body;

    if (is_disabled === undefined) {
      return res.status(400).json({ status: 'error', message: 'is_disabled requis' });
    }

    const user = await userService.toggleUserDisabled(+id_user, is_disabled);
    res.json({ status: 'success', message: 'Utilisateur mis à jour', data: user });
  }

  async updatePassword(req: Request, res: Response) {
    const { id_user } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ status: 'error', message: 'Nouveau mot de passe requis' });
    }

    const user = await userService.updatePassword(+id_user, newPassword);
    res.json({ status: 'success', message: 'Mot de passe mis à jour', data: user });
  }
  async updateProfilePicture(req: Request, res: Response) {
    const { id_user } = req.params;
    const { pictureUrl } = req.body;

    if (!pictureUrl) {
      return res.status(400).json({ status: 'error', message: 'URL de la photo de profil requise' });
    }

    const user = await userService.updateProfilePicture(+id_user, pictureUrl);
    res.json({ status: 'success', message: 'Photo de profil mise à jour', data: user });
  }

    async signup(req: Request, res: Response) {
    try {
      const user = await userService.signup(req.body);
      res.status(201).json({ status: 'success', data: user });
    } catch (e: any) {
      res.status(400).json({ status: 'error', message: e.message });
    }
  }

  async signin(req: Request, res: Response) {
    try {
    const { email, password } = req.body;
    const { id, email: userEmail, token } = await userService.signin(email, password);
    console.log("Retour de userService.signin :", { id, userEmail, token });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
    
    res.status(200).json({
        status: "success", 
      message: 'Connexion réussie',
    // <== ajoute le token ici
      user: {
        id,
        email: userEmail
      }
    });
    } catch (e: any) {
      res.status(400).json({ status: 'error', message: e.message });
    }
  }
async logOut(req: Request, res: Response) {
  try {
    // Récupérer l'ID depuis le token JWT
    const userPayload = (req as any).user;
    if (!userPayload?.id) {
      return res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
    }

    const result = await userService.logout(userPayload.id);
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.json({ message: 'Déconnexion réussie', data: result });
  } catch (e: any) {
    res.status(400).json({ status: 'error', message: e.message });
  }
}
   public async updateRole(req: Request, res: Response) : Promise< void> {
    try {
      // 1) récupère le payload du token
      const me = (req as any).user as { id: number; role: string };

      // 2) vérifie qu’il s’agit d’un admin_app
      if (me.role !== 'admin_app') {
         res
          .status(403)
          .json({ status: 'error', message: 'Accès réservé aux admins app' });
          return;
      }

      // 3) récupère l’id et le rôle
      const targetId = Number(req.params.id);
      const newRole = req.body.role;
      if (!newRole) {
         res
          .status(400)
          .json({ status: 'error', message: 'Le champ `role` est requis' });
          return;
      }

      // 4) appelle le service
      const updated = await userService.updateUserRole(targetId, newRole);

      // 5) retourne la réponse
      res.json({ status: 'success', data: updated });
      return ;
    } catch (err: any) {
      res
        .status(400)
        .json({ status: 'error', message: err.message });
         return;
    }
  }

 async getById(req: Request, res: Response): Promise<void> {
   console.log("❌ getById appelé avec param :", req.params.id); // 👈 Ajoute ça
  
  try {
    const id = parseInt(req.params.id, 10);
    console.log("🔍 ID parsé :", id); // 👈 Et ça

    if (isNaN(id)) {
      console.log("❌ ID invalide, envoi erreur 400"); // 👈 Et ça
      res.status(400).json({ status: 'error', message: 'Invalid user id' });
      return;
    }

    const user = await userService.findById(id);
    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}
  }



const controller = new UserController();
export const userController = {
  getAll: asyncHandler(controller.getAll.bind(controller)),
  getById: asyncHandler(controller.getById.bind(controller)),
  create: asyncHandler(controller.create.bind(controller)),
  update: asyncHandler(controller.update.bind(controller)),
  delete: asyncHandler(controller.delete.bind(controller)),
  findByEmail: asyncHandler(controller.findByEmail.bind(controller)),
  searchByName: asyncHandler(controller.searchByName.bind(controller)),
  disableUser: asyncHandler(controller.disableUser.bind(controller)),
  updatePassword: asyncHandler(controller.updatePassword.bind(controller)),
  updateProfilePicture: asyncHandler(controller.updateProfilePicture.bind(controller)),
  signup: asyncHandler(controller.signup.bind(controller)),
  signin: asyncHandler(controller.signin.bind(controller)),
  logOut: asyncHandler(controller.logOut.bind(controller)),
  updateRole: asyncHandler(controller.updateRole.bind(controller)),
  getMe:asyncHandler(controller.getMe.bind(controller))
}

