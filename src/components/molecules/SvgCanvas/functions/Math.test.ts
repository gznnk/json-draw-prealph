import { radiansToDegrees } from "./Math";

test("Math radiansToDegrees", () => {
	expect(radiansToDegrees(0)).toBe(0);
	expect(radiansToDegrees(Math.PI / 2)).toBe(90);
	expect(radiansToDegrees(Math.PI)).toBe(180);
	expect(radiansToDegrees((Math.PI / 2) * 3)).toBe(270);
	expect(radiansToDegrees(Math.PI * 2)).toBe(360);
	expect(radiansToDegrees(-Math.PI / 2)).toBe(-90);
	expect(radiansToDegrees(-Math.PI)).toBe(-180);
	expect(radiansToDegrees(-(Math.PI / 2) * 3)).toBe(-270);
	expect(radiansToDegrees(-Math.PI * 2)).toBe(-360);
});
