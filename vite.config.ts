import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

//this is just to make vite understands the import pattern that I have created in tsconfig file
export default defineConfig({
	plugins: [tsconfigPaths()]
});