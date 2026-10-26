import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "../src/index";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("実行環境の夏時間による表示用Dateの制約", () => {
	// 現地時刻の正確さではなく、memoで合意したDateと時差の組み合わせを確認する。
	it.each([
		["存在しない02:30", "2026-03-08T02:30:00Z", 3, 5],
		["夏時間開始をまたぐ時差", "2026-03-08T06:30:00Z", 6, 4],
		["夏時間終了をまたぐ時差", "2026-11-01T05:30:00Z", 5, 5],
	] as const)("%sでも表示用Dateを基に時差を返す", (_, now, hour, offset) => {
		vi.setSystemTime(new Date(now));
		const info = get("uk");
		expect(info.date.getHours()).toBe(hour);
		expect(info.date.getMinutes()).toBe(30);
		expect(info.offsetHours).toBe(offset);
	});
});
