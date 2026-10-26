import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		projects: ["UTC", "Asia/Tokyo", "America/New_York"].map((timeZone) => ({
			test: {
				name: timeZone,
				include: [
					timeZone === "America/New_York"
						? "test/daylight-saving.test.ts"
						: "test/index.test.ts",
				],
				environment: "node",
				pool: "forks",
				env: { TZ: timeZone },
			},
		})),
	},
});
