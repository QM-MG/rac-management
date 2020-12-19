module.exports = {
    devServer: {
        proxy: {
            '/': {
                // target: 'http://60.205.211.38:8081',
                target: 'http://127.0.0.1:8081',
                changeOrigin: true
            }
        }
    }
}