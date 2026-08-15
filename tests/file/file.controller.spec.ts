import { FileController } from '../../src/file/file.controller';

describe('FileController', () => {
  it('should delegate addFile to the service', async () => {
    const fileService = {
      addFile: jest.fn().mockResolvedValue({ message: 'file uploaded' }),
    };

    const controller = new FileController(fileService as any);
    const file = {
      filename: 'hero.png',
      path: '/tmp/hero.png',
    } as any;
    const req = { login_status: true } as any;

    await expect(controller.addFile(file, 'Asta', 'icon', req)).resolves.toBeUndefined();
    expect(fileService.addFile).toHaveBeenCalledWith({
      name: 'Asta',
      imageType: 'icon',
      filename: 'hero.png',
      path: '/tmp/hero.png',
      req,
    });
  });
});
