module.exports = {
    devServer: {
        proxy: {
            '/': {
                target: 'http://60.205.211.38:8081',
                // target: 'http://192.168.2.97:8081',
                changeOrigin: true
            }
        }
    }
}