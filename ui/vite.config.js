import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
	resolve: {
		alias: {
			'@': `${path.resolve(__dirname, 'src')}`,
		},
	},

	build: {
		minify: true,
	},

	plugins: [
		vue(),
	],

	server: {
		host: "127.0.0.1",
		port: 8080,
		proxy: {
			"^/api": {
				target: "http://127.0.0.1:8095",
			},
    }
	},
})
