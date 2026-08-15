import { AuthController } from '../../src/auth/auth.controller';

describe('AuthController', () => {
  it('should delegate signIn to the service', () => {
    const authService = {
      signIn: jest.fn().mockResolvedValue({ token: 'token-123' }),
      turn2FA: jest.fn(),
      loginW2FA: jest.fn(),
      generateQRDataUrl: jest.fn(),
    };

    const controller = new AuthController(authService as any);
    const dto = { name: 'alice', pass: 'secret' } as any;

    return controller.signIn(dto).then((result) => {
      expect(result).toEqual({ token: 'token-123' });
      expect(authService.signIn).toHaveBeenCalledWith(dto);
    });
  });

  it('should delegate turn2FA to the service', () => {
    const authService = {
      signIn: jest.fn(),
      turn2FA: jest.fn().mockResolvedValue({ message: '2FA toggled' }),
      loginW2FA: jest.fn(),
      generateQRDataUrl: jest.fn(),
    };

    const controller = new AuthController(authService as any);
    const dto = { name: 'alice', pass: 'secret' } as any;

    return controller.turn2FA(dto, '123456').then((result) => {
      expect(result).toEqual({ message: '2FA toggled' });
      expect(authService.turn2FA).toHaveBeenCalledWith(dto, '123456');
    });
  });

  it('should delegate loginW2FA to the service', () => {
    const authService = {
      signIn: jest.fn(),
      turn2FA: jest.fn(),
      loginW2FA: jest.fn().mockResolvedValue({ token: 'two-factor-token' }),
      generateQRDataUrl: jest.fn(),
    };

    const controller = new AuthController(authService as any);

    return controller.loginW2FA('alice', '123456').then((result) => {
      expect(result).toEqual({ token: 'two-factor-token' });
      expect(authService.loginW2FA).toHaveBeenCalledWith('alice', '123456');
    });
  });

  it('should delegate generateQRDataUrl to the service', () => {
    const authService = {
      signIn: jest.fn(),
      turn2FA: jest.fn(),
      loginW2FA: jest.fn(),
      generateQRDataUrl: jest.fn().mockResolvedValue('data:image/png;base64,abcd'),
    };

    const controller = new AuthController(authService as any);

    return controller.generateQRDataUrl({ url: 'otpauth://example' }).then((result) => {
      expect(result).toBe('data:image/png;base64,abcd');
      expect(authService.generateQRDataUrl).toHaveBeenCalledWith('otpauth://example');
    });
  });
});
