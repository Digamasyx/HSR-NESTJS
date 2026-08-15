import { AppController } from '../../src/app.controller';

describe('AppController', () => {
  it('should return the app greeting from the service', () => {
    const appService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
    };

    const controller = new AppController(appService as any);

    expect(controller.getHello()).toBe('Hello World!');
    expect(appService.getHello).toHaveBeenCalledTimes(1);
  });
});
