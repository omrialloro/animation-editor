import { generateDefaultFrames } from './defaults';

describe('@generateDefaultFrames', () => {
  test('should work', () => {
    const expected = [];
    expect(generateDefaultFrames()).toEqual(expected);
  })
})