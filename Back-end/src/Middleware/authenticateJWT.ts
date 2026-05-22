import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../utils/jwt';
import { userService } from '../Service/UserService';






export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("➡️ authMiddleware appelé"); 
  const token = req.cookies.token;
  console.log("Token reçu :", token); // 👈 Étape 1

  if (!token) {
    res.status(401).json({ error: 'Accès refusé, token manquant' });
     return
  }

 try {
  const payload: any = verifyToken(token);
  console.log("Payload JWT :", payload);

  const userId = Number(payload.id || payload.id_user);

  if (isNaN(userId)) {
    console.log("ID utilisateur invalide dans le payload :", payload);
    res.status(401).json({ error: 'ID utilisateur invalide (NaN)' });
    return;
  }

  const user = await userService.findById(userId);
  if (!user || user.token !== token) {
    res.status(401).json({ error: 'Token invalide ou utilisateur introuvable' });
    return;
  }

  (req as any).user = payload;
  next();
} catch (err) {
  console.error("Erreur vérification token :", err);
  res.status(401).json({ error: 'Token expiré ou invalide' });
}

}
