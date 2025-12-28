import { worker } from './worker.js';

describe('worker', () => {
  it('should work', () => {
    expect(worker()).toEqual('worker');
  });
});
