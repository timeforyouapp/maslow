import x from '../src/actionCreator';

describe('actionCreator', () => {
   it('d', () => {
       expect(x(1,2)).toBe(3);
   });
});