import { BadRequestException, NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserProvider } from './user.provider';
import { AccessLevel } from '@roles/roles.enum';
import { UserProps } from './types/user.enum';

// Mocka o bcrypt uma única vez para todo o arquivo
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_string'),
}));

describe('UserProvider', () => {
  let provider: UserProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProvider],
    }).compile();

    provider = module.get<UserProvider>(UserProvider);
  });

  /* ------------------------------------------------- */
  /* passHash                                          */
  /* ------------------------------------------------- */
  it('should return the hashed string of the password', async () => {
    const result = await provider.passHash('plain');
    expect(result).toBe('hashed_string');
  });

  /* ------------------------------------------------- */
  /* userStatus                                        */
  /* ------------------------------------------------- */
  it('should return "not_logged" when login_status is false', () => {
    const req: any = { login_status: false };
    expect(provider.userStatus(req)).toBe('not_logged');
  });

  it('should return AccessLevel.ADMIN when admin is logged in', () => {
    const req: any = {
      login_status: true,
      user: { access_level: AccessLevel.ADMIN },
    };
    expect(provider.userStatus(req)).toBe(AccessLevel.ADMIN);
  });

  it('should return AccessLevel.USER when regular user is logged in', () => {
    const req: any = {
      login_status: true,
      user: { access_level: AccessLevel.USER },
    };
    expect(provider.userStatus(req)).toBe(AccessLevel.USER);
  });

  it('should return "not_logged" when login_status is undefined', () => {
    const req: any = {};
    expect(provider.userStatus(req)).toBe('not_logged');
  });

  /* ------------------------------------------------- */
  /* hasPermission                                     */
  /* ------------------------------------------------- */
  const mockUser = { user_uuid: 'abc' };

  it('should deny permission when not logged in', () => {
    const req: any = { login_status: false };
    expect(provider.hasPermission(mockUser, req)).toBe(false);
  });

  it('should grant permission to ADMIN', () => {
    const req: any = {
      login_status: true,
      user: { access_level: AccessLevel.ADMIN },
    };
    expect(provider.hasPermission(mockUser, req)).toBe(true);
  });

  it('should grant permission when uuid matches', () => {
    const req: any = {
      login_status: true,
      user: { access_level: AccessLevel.USER, uuid: 'abc' },
    };
    expect(provider.hasPermission(mockUser, req)).toBe(true);
  });

  it('should deny permission when uuid differs', () => {
    const req: any = {
      login_status: true,
      user: { access_level: AccessLevel.USER, uuid: 'xyz' },
    };
    expect(provider.hasPermission(mockUser, req)).toBe(false);
  });

  /* ------------------------------------------------- */
  /* genRandomString                                   */
  /* ------------------------------------------------- */
  it('should generate string with correct length', () => {
    const str = provider.genRandomString(18);
    expect(str).toHaveLength(18);
  });

  it.each([
    ['number', [0, 1, 0]],
    ['string', [1, 0, 0]],
    ['symbol', [0, 0, 1]],
  ])('should create values only of type %p', (type, arg) => {
    const str = provider.genRandomString(18, arg as any);
    expect(str).toHaveLength(18);
    if (type === 'number') expect(str).toMatch(/^-?[0-9]+$/);
    else if (type === 'string') expect(str).toMatch(/^[a-zA-Z]+$/);
    else expect(str).toMatch(/^[!@#$&*+\-.~]+$/);
  });

  it('should throw BadRequestException when weights do not sum to 1', () => {
    expect(() => provider.genRandomString(6, [0.5, 0.3, 0.3])).toThrow(
      BadRequestException,
    );
  });

  /* ------------------------------------------------- */
  /* genRandomNormalizedWeights                        */
  /* ------------------------------------------------- */
  it('should generate three normalized weights whose sum ≈ 1', () => {
    const w = provider.genRandomNormalizedWeights();
    const sum = w.reduce((a, b) => a + b, 0);
    expect(w).toHaveLength(3);
    expect(sum).toBeCloseTo(1, 5);
  });

  /* ------------------------------------------------- */
  /* nonNullProperties                                 */
  /* ------------------------------------------------- */
  it('should list only non-null properties', () => {
    const props = provider.nonNullProperties({ name: 'John', pass: null });
    expect(props).toEqual(['name', 'pass']);
  });

  it('should throw BadRequestException when 0 properties are present', () => {
    // força cenário com chave numérica
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => provider.nonNullProperties({})).toThrow(BadRequestException);
  });

  /* ------------------------------------------------- */
  /* outMessage                                        */
  /* ------------------------------------------------- */
  it.each`
    type                         | arg
    ${UserProps.create_pass}     | ${{ name: 'john' }}
    ${UserProps.create_wo_pass}  | ${{ name: 'john', pass: 'abc' }}
    ${UserProps.delete}          | ${{ name: 'john', uuid: 'uuid' }}
    ${UserProps.update}          | ${{ properties: ['name'] }}
    ${UserProps.update_w_random} | ${{ properties: ['name'], pass: 'abc' }}
  `('should return message to $type', ({ type, arg }) => {
    const { message } = provider.outMessage(type, arg as any);
    let match = '';
    switch (type) {
      case UserProps.create_pass:
        match = `User with name: ${arg.name} was created.`;
        break;
      case UserProps.create_wo_pass:
        match = `User with name: ${arg.name} was created with the following pass: ${arg.pass}`;
        break;

      case UserProps.delete:
        match = `User with name: '${arg.name}' & UUID: '${arg.uuid}' was deleted.`;
        break;

      case UserProps.update:
        match = `The following field(s) were changed: '${arg.properties.join(', ')}'`;
        break;

      case UserProps.update_w_random:
        match = `The following field(s) were changed: '${arg.properties.join(', ')}' with pass '${arg.pass}'`;
        break;
    }
    expect(typeof message).toBe('string');
    expect(message).toMatch(match);
  });

  it('should throw NotImplementedException for unknown enum', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => provider.outMessage('UNKNOWN', {})).toThrow(
      NotImplementedException,
    );
  });
});
