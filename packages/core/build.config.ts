import { defineBuildConfig } from "unbuild";
export default defineBuildConfig({
    // If entries is not provided, will be automatically inferred from package.json
    entries: [
        "./src/index",
    ],
    // Generates .d.ts declaration file
    declaration: true,
    externals: ['node', 'vite', 'better-sqlite3']
});