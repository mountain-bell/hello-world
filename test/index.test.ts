import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HelloWorld, {
	get,
	getDate,
	getGreet,
	getOffsetHours,
	getTimeZone,
} from "../src/index";

const localZone = process.env.TZ as "UTC" | "Asia/Tokyo";
const offsetIndex = localZone === "UTC" ? 0 : 1;

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(new Date("2026-01-15T12:34:56.789Z"));
});

afterEach(() => vi.useRealTimers());

describe("場所の省略・local指定", () => {
	it("getで場所を省略すると、実行環境の現在日時とタイムゾーン、時差0を返す", () => {
		expect(get()).toEqual({
			greet: "Hello, World!",
			timeZone: localZone,
			date: new Date("2026-01-15T12:34:56.789Z"),
			offsetHours: 0,
		});
		expect(get("local")).toEqual(get());
	});

	it("個別のgetterでも、場所を省略するとローカルの情報を返す", () => {
		expect(getGreet()).toBe("Hello, World!");
		expect(getTimeZone()).toBe(localZone);
		expect(getDate().getTime()).toBe(Date.now());
		expect(getOffsetHours()).toBe(0);
		expect(Object.is(getOffsetHours(), -0)).toBe(false);
	});

	it("getDateは呼び出すたびに現在日時を取得する", () => {
		const first = getDate();
		vi.advanceTimersByTime(1000);
		expect(getDate().getTime() - first.getTime()).toBe(1000);
	});
});

describe("国別の情報取得", () => {
	it.each([
		["japan", "こんにちは、世界！", "Asia/Tokyo", [9, 0]],
		["korea", "안녕하세요, 세계!", "Asia/Seoul", [9, 0]],
		["china", "你好，世界！", "Asia/Shanghai", [8, -1]],
		["taiwan", "哈囉，世界！", "Asia/Taipei", [8, -1]],
		["hong_kong", "你好，世界！", "Asia/Hong_Kong", [8, -1]],
		["singapore", "Hello, World!", "Asia/Singapore", [8, -1]],
		["india", "Hello, World!", "Asia/Kolkata", [5.5, -3.5]],
		["uk", "Hello, World!", "Europe/London", [0, -9]],
		["france", "Bonjour, le monde !", "Europe/Paris", [1, -8]],
		["germany", "Hallo, Welt!", "Europe/Berlin", [1, -8]],
		["spain", "¡Hola, mundo!", "Europe/Madrid", [1, -8]],
		["italy", "Ciao, mondo!", "Europe/Rome", [1, -8]],
		["netherlands", "Hallo, wereld!", "Europe/Amsterdam", [1, -8]],
		["sweden", "Hej, världen!", "Europe/Stockholm", [1, -8]],
		["usa", "Hello, World!", "America/New_York", [-5, -14]],
		["canada", "Hello, World!", "America/Toronto", [-5, -14]],
		["mexico", "¡Hola, mundo!", "America/Mexico_City", [-6, -15]],
		["brazil", "Olá, mundo!", "America/Sao_Paulo", [-3, -12]],
		[
			"argentina",
			"¡Hola, mundo!",
			"America/Argentina/Buenos_Aires",
			[-3, -12],
		],
		["australia", "Hello, World!", "Australia/Sydney", [11, 2]],
		["new_zealand", "Hello, World!", "Pacific/Auckland", [13, 4]],
		["south_africa", "Hello, World!", "Africa/Johannesburg", [2, -7]],
	] as const)(
		"%sを指定すると、その国の挨拶・タイムゾーン・実行環境との時差を返す",
		(location, greet, timeZone, offsets) => {
			const offsetHours = offsets[offsetIndex];
			const info = get(location);
			expect(info.greet).toBe(greet);
			expect(info.timeZone).toBe(timeZone);
			expect(info.offsetHours).toBe(offsetHours);
			expect(getGreet(location)).toBe(greet);
			expect(getTimeZone(location)).toBe(timeZone);
			expect(getOffsetHours(location)).toBe(offsetHours);
			expect(getDate(location)).toEqual(info.date);
		}
	);

	it.each([
		["japan", "2026-12-31T18:04:05Z", [2027, 1, 1, 3, 4, 5]],
		["usa", "2026-01-01T02:04:05Z", [2025, 12, 31, 21, 4, 5]],
		["india", "2026-01-15T12:34:56Z", [2026, 1, 15, 18, 4, 56]],
	] as const)(
		"%sを指定すると、現地の年月日と時刻をローカルgetterで取得できる",
		(location, now, expected) => {
			vi.setSystemTime(new Date(now));
			const date = get(location).date;
			expect(date).toBeInstanceOf(Date);
			expect([
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
			]).toEqual(expected);
		}
	);

	it("夏の日付を指定すると、指定国のその日の時差を返す", () => {
		vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
		expect(getOffsetHours("usa")).toBe([-4, -13][offsetIndex]);
		expect(getOffsetHours("australia")).toBe([10, 1][offsetIndex]);
	});
});

describe("公開APIの共通仕様", () => {
	it("default exportとnamed exportで同じAPIを利用できる", () => {
		expect(HelloWorld).toEqual({
			get,
			getGreet,
			getTimeZone,
			getDate,
			getOffsetHours,
		});
	});

	for (const [name, getter] of Object.entries(HelloWorld)) {
		it(`${name}に未対応の場所を渡すと、指定値を含むエラーを投げる`, () => {
			// @ts-expect-error JavaScriptから型に合わない値が渡された場合を確認する。
			expect(() => getter("unknown")).toThrow('"unknown"');
		});
		it(`${name}にnullを渡すと、TypeErrorを投げる`, () => {
			// @ts-expect-error JavaScriptから型に合わない値が渡された場合を確認する。
			expect(() => getter(null)).toThrow(TypeError);
		});
	}
});
