import { createTypeormRelationsArray } from './relations.transform';
describe('relations transformer', () => {
  it('1', () => {
    expect(
      createTypeormRelationsArray({
        d: {
          1: {},
        },
        c: {
          1: {},
          2: {},
          3: {},
        },
      } as any).sort()
    ).toStrictEqual(['d', 'd.1', 'c', 'c.1', 'c.2', 'c.3'].sort());
  });

  it('1', () => {
    expect(
      createTypeormRelationsArray({
        d: {},
        c: {
          1: {},
          2: {},
        },
      } as any).sort()
    ).toStrictEqual(['d', 'c', 'c.1', 'c.2'].sort());
  });
});
