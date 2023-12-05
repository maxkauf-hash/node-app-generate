module.exports = () => {
    const fs = require('fs')

    const foldersToCreate = ['./src', './src/db', './src/models', './src/routes']
    const fileContents =
    {
        './app.js': "const dotenv = require('dotenv').config()\nconst express = require('express')\nconst app = express()\nconst sequelize = require('./src/db/sequelize')\n\nsequelize.initDb()\n\napp.listen(process.env.SERVER_PORT, () => console.log(`Application démarrée sur le serveur: http://localhost:${process.env.SERVER_PORT}`))",
        './src/db/sequelize.js': "const { Sequelize, DataTypes } = require('sequelize')\nconst sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {\nhost: process.env.DB_HOST,\ndialect: 'mariadb',\ndialectOptions: {\ntimezone: 'Etc/GMT-2'\n},\nlogging: false\n})\nconst initDb = () => {\nsequelize.authenticate()\n.then(() => {\nconsole.log('Connexion à la base de données établie avec succès.');\n})\n.catch(err => {\nconsole.error('Impossible de se connecter à la base de données:', err);\n});\nreturn sequelize.sync({ force: true });\n};\nmodule.exports = {\ninitDb\n}",
        './.env': "DB_NAME = restaurant\nDB_USER = root\nDB_PASS = ''\nDB_HOST = localhost\nSERVER_PORT = 3000"
    }

    async function createFiles() {
        for (const [filePath, content] of Object.entries(fileContents)) {
            try {
                await fs.promises.writeFile(filePath, content)
                console.log((`Fichier créé : ${filePath}`))
            } catch (error) {
                console.error(`Erreur lors de la création du fichier ${filePath}`, error)
            }
        }
    }

    async function createFolders() {
        await Promise.all(foldersToCreate.map(folder => fs.mkdir(folder, { recursive: true }, (err) => { if (err) throw new err })))
    }

    async function setUpProject() {
        try {
            createFiles()
            createFolders()
            console.log('La structure du projet a été initialisée avec succès')
        } catch (error) {
            console.error('Il y a eu une erreur lors de la création de la structure du projet', error)
        }
    }

    setUpProject()
}