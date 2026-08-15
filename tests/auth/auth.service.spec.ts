import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { compare } from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('AuthService', () => {
  const mockedCompare = compare as jest.MockedFunction<typeof compare>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN = 'test-secret';
  });

  it('should sign in and return a JWT token when the credentials are valid', async () => {
    const userRepo = {
      findOne: jest.fn().mockResolvedValue({
        name: 'alice',
        pass: 'hashed-pass',
        is2FAActivated: false,
        user_uuid: 'uuid-1',
        access_level: 2,
      }),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn().mockResolvedValue('jwt-token') };
    mockedCompare.mockResolvedValue(true as never);

    const service = new AuthService(userRepo as any, jwtService as any);

    await expect(service.signIn({ name: 'alice', pass: 'plain-pass' } as any)).resolves.toEqual({
      token: 'jwt-token',
    });
    expect(userRepo.findOne).toHaveBeenCalled();
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'alice', uuid: 'uuid-1' }),
      { secret: 'test-secret' },
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    const userRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };

    const service = new AuthService(userRepo as any, jwtService as any);

    await expect(service.signIn({ name: 'ghost', pass: 'any' } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException when password is wrong', async () => {
    const userRepo = {
      findOne: jest.fn().mockResolvedValue({
        name: 'alice',
        pass: 'hashed-pass',
        is2FAActivated: false,
        user_uuid: 'uuid-1',
        access_level: 2,
      }),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };
    mockedCompare.mockResolvedValue(false as never);

    const service = new AuthService(userRepo as any, jwtService as any);

    await expect(service.signIn({ name: 'alice', pass: 'wrong-pass' } as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should generate a QR code data URL', async () => {
    const qr = require('qrcode');
    qr.toDataURL.mockResolvedValue('data:image/png;base64,valid');

    const userRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };

    const service = new AuthService(userRepo as any, jwtService as any);

    await expect(service.generateQRDataUrl('otpauth://example')).resolves.toBe(
      'data:image/png;base64,valid',
    );
    expect(qr.toDataURL).toHaveBeenCalledWith('otpauth://example');
  });

  it('should reject invalid 2FA code format', async () => {
    const userRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };

    const service = new AuthService(userRepo as any, jwtService as any);

    await expect(service.loginW2FA('alice', 'invalid')).rejects.toThrow(BadRequestException);
  });

  it('should reject login when 2FA is not activated for the user', async () => {
    const userRepo = {
      findOne: jest.fn().mockResolvedValue({
        twoFacSecret: null,
        is2FAActivated: false,
        user_uuid: 'uuid-1',
        access_level: 2,
      }),
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };

    const service = new AuthService(userRepo as any, jwtService as any);

    await expect(service.loginW2FA('alice', '123456')).rejects.toThrow(UnauthorizedException);
  });
});
