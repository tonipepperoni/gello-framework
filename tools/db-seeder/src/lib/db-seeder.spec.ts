import { dbSeeder } from './db-seeder';

describe('dbSeeder', () => {
  it('should work', () => {
    expect(dbSeeder()).toEqual('db-seeder');
  });
});
