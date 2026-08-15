import { RelicsService } from '../../src/relics/relics.service';

describe('RelicsService', () => {
  it('should be defined', () => {
    expect(new RelicsService()).toBeInstanceOf(RelicsService);
  });
});
