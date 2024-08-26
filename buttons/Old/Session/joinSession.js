const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "joinSession",
    },

    async execute(interaction) {
        const message = interaction.message;
        const actPlayers = interaction.client.sessions.get(message.id).players;
        const dm = await interaction.guild.members.fetch(
            interaction.client.sessions.get(message.id).dm
        );
        if (
            !actPlayers.includes(interaction.user.id) &&
            interaction.user.id != dm.id
        ) {
            actPlayers.push(interaction.user.id);
            const players = await interaction.guild.members.fetch({
                user: actPlayers,
            });
            const playerNames = players
                .map((player) => player.user.username)
                .join("\n");
            const sessionCreatedEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle("A new Dungeons and Dragons session has started!")
                .setDescription(
                    "Someone has started a new Dungeons and Dragons session. If you want to join the fun, click join!"
                )
                .setThumbnail(
                    "https://cdn.pixabay.com/photo/2017/08/31/04/01/d20-2699387_1280.png"
                )
                .addFields({
                    name: "The DM for this session is:",
                    value: dm.user.username,
                })
                .addFields({
                    name: "The Players are:",
                    value: playerNames,
                });

            message.edit({ embeds: [sessionCreatedEmbed] });

            await interaction.reply(
                `${interaction.user.username} joined the session!`
            );
        } else {
            await interaction.reply({
                content: `${interaction.user.username} you already joined the session...`,
                ephemeral: true,
            });
        }
    },
};
