const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("session")
        .setDescription("starts a dnd session")
        .addUserOption((option) =>
            option
                .setName("dm")
                .setDescription("The Dungeon Master for this session")
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.channel;
        const dm = interaction.options.getUser("dm");
        const join = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("joinSession")
                .setLabel("join")
                .setStyle(ButtonStyle.Primary)
        );
        const sessionCreated = new EmbedBuilder()
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
                value: `${dm.username}`,
            });

        interaction.user.id == dm.id
            ? sessionCreated.addFields({
                  name: "The Players are:",
                  value: "no one here yet",
              })
            : sessionCreated.addFields({
                  name: "The Players are:",
                  value: `${interaction.user.username}`,
              });

        await interaction.reply({
            embeds: [sessionCreated],
            components: [join],
        });

        const message = await interaction.fetchReply();

        interaction.client.sessions.set(message.id, {
            dm: dm.id,
            players: interaction.user.id == dm.id ? [] : [interaction.user.id],
        });

        const filter = (m) => m.content.startsWith("?session");
        const collector = interaction.channel.createMessageCollector({
            filter,
            idle: 36000000,
        });

        collector.on("collect", (m) => {
            switch (m.content) {
                case "?session end":
                    collector.stop();
                    break;
                case "?session join":
                    break;
                case "?session start":
                    channel.send(`You started a session.`);
                    break;
                default:
                    channel.send(`I don't know that command, sorry...`);
                    break;
            }
            console.log(`Collected ${m.content}`);
        });

        collector.on("end", (collected) => {
            console.log(`Collected ${collected.size} items`);
        });
    },
};
