// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
const { Events, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Adding models to database
        const modelsPath = path.join(__dirname, "../database/models");
        const modelFiles = fs
            .readdirSync(modelsPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of modelFiles) {
            require(path.join(modelsPath, file))(client.sequelize);
        }
        await client.sequelize.sync();
        // Creating collection for constant tables
        const templates = new Collection();
        const templatesPath = path.join(__dirname, "../database/data");
        const templateFiles = fs
            .readdirSync(templatesPath)
            .filter((file) => file.endsWith(".json"));
        for (const file of templateFiles) {
            templates.set(
                file.replace(".json", ""),
                require(path.join(templatesPath, file))
            );
        }
        let promises = [];
        // Reading data of constant tables
        templates.forEach((template, templateName) => {
            const model = client.sequelize.models[templateName];
            if (templateName == "games") {
                template.forEach(async(element) => {
                    const games = await client.sequelize.models.games.findAll({
                        where: { name: element.name, owner: element.owner },
                    });
                    if (games.length == 0) {
                        promises.push(model.upsert(element));
                    }
                });
            } else{
                template.forEach((element) => {
                    promises.push(model.upsert(element));
                });
            }
        });

        // Executing promises
        await Promise.all(promises).catch(console.error());
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
