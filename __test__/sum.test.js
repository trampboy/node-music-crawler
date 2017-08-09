/**
 * Created by YanMingDao on 09/08/2017.
 */
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});