/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

module.exports = {
	webpackDevMiddleware: (config: { watchOptions: { ignored: string[] } }) => {
		config.watchOptions = {
			ignored: [
				'**/C:/pagefile.sys',
				'**/C:/swapfile.sys',
				'**/C:/DumpStack.log.tmp',
			],
		};
		return config;
	},
};
