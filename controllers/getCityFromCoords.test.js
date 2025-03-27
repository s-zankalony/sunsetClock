const getCityFromCoords = require('./getCityFromCoords');

test('returns city for valid coordinates', () => {
	expect(getCityFromCoords(40.7128, -74.0060)).toBe('New York');
});

test('returns undefined for invalid coordinates', () => {
	expect(getCityFromCoords(null, null)).toBeUndefined();
});

test('returns city for different valid coordinates', () => {
	expect(getCityFromCoords(51.5074, -0.1278)).toBe('London');
});