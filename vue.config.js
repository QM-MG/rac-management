module.exports = {
    devServer: {
        proxy: {
            '/': {
                target: 'http://192.168.2.97:8081',
                changeOrigin: true
            }
        }
    }
}