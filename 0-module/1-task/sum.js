/**
 * Возвращает сумму двух чисел
 *
 * @param {number} a
 * @param {number} b
 * @throws Выбрасывает ошибку, если один из аргументов не является числом
 * @return {number}
 */
const sum = (a, b) => {
  if (!Number.isInteger(a)) {
    throw new TypeError('TypeError: a is not a number. Argument "a" is: ' + typeof(a));
  }

  if (!Number.isInteger(b)) {
    throw new TypeError('TypeError: b is not a number. Argument "b" is: ' + typeof(b));
  }

  return a + b;
};

module.exports = sum;
