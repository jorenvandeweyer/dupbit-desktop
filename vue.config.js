module.exports = {
    pluginOptions: {
        electronBuilder: {
            externals: ['keytar'],
            nodeIntegration: true,
            productName: 'Dupbit',
            "appId": "com.dupbit.desktop",
            "mac": {
                "category": "public.app-category.utilities"
            }

        }
    },
}
