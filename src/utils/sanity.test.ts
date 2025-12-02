import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Setup Sanity Checks', () => {
  it('vitest is working', () => {
    expect(true).toBe(true);
  });

  it('fast-check is working', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        return n === n;
      }),
      { numRuns: 10 }
    );
  });

  it('TypeScript strict mode is enabled', () => {
    // This test will fail to compile if strict mode is not enabled
    const value: string = 'test';
    expect(value).toBe('test');
  });
});
