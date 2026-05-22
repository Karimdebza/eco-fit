import { authMiddleware } from '../../Middleware/authenticateJWT';
import { verifyToken } from '../../utils/jwt';
import { userService } from '../../Service/UserService';

jest.mock('../../utils/jwt');
jest.mock('../../Service/UserService');

describe('authMiddleware', () => {
  const mockReq: any = { cookies: {} };
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq.cookies = {};
    mockRes.status.mockClear();
    mockRes.json.mockClear();
    mockNext.mockClear();
  });

  it('should return 401 if no token', async () => {
    await authMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Accès refusé, token manquant' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token invalid', async () => {
  const originalConsoleError = console.error;
  console.error = jest.fn();

  mockReq.cookies.token = 'badtoken';
  (verifyToken as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });

  await authMiddleware(mockReq, mockRes, mockNext);

  expect(mockRes.status).toHaveBeenCalledWith(401);
  expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token expiré ou invalide' });

  console.error = originalConsoleError;
});

  it('should return 401 if user not found or token mismatch', async () => {
    mockReq.cookies.token = 'validtoken';
    (verifyToken as jest.Mock).mockReturnValue({ id_user: 1 });
    (userService.findById as jest.Mock).mockResolvedValue({ token: 'othertoken' });

    await authMiddleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token invalide ou utilisateur introuvable' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() if token valid and user found', async () => {
  mockReq.cookies.token = 'validtoken';
  const payload = { id_user: 1 };
  (verifyToken as jest.Mock).mockReturnValue(payload);
  (userService.findById as jest.Mock).mockResolvedValue({ token: 'validtoken' });

  await authMiddleware(mockReq, mockRes, mockNext);
  expect(mockNext).toHaveBeenCalled();
  expect((mockReq as any).user).toEqual(payload);
});
});
