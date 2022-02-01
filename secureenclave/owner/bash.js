// Run shell commands on the host machine 

const { exec } = require('child_process');
const Discord = require('discord.js');

require('../../applesilicon/embed.js')();

module.exports = {
    name: 'bash',
    command: 'bash <command>',
    category: 'Owner',
    description: '**[Owner Only]** Executes a bash command.',
    async execute(message, args) {
        let isBotOwner = message.author.id == process.env.owner_id;
        if (!isBotOwner) return message.reply(error_alert('You know what, it\'s my job to prevent strangers on Discord from damaging my own house with bash commands!'));

        if (!args.join(" ")) return message.reply(error_alert('Empty bash command, interesting!'));

        const m_embed = new Discord.MessageEmbed().setDescription(`Executing \`${args.join(" ")}\`...`);
        const m = await message.reply({ embeds: [m_embed] });
        exec(args.join(" "), (err, stdout, stderr) => {
            if (err) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`**Command exited with error:** \n \`\`\`${err}\`\`\``)
                    .setTimestamp();
                m.edit({ embeds: [embed] });
                return;
            }

            var error = (stderr) ? stderr : "No Error";
            var output = (stdout) ? stdout : "No Output"

            if (output.length > 4000) output = output.substring(0, 4000) + '...';
            if (error.length > 4000) error = error.substring(0, 4000) + '...';

            const embed = new Discord.MessageEmbed()
                .addField(`Output`, `\`\`\`${output}\`\`\``)
                .addField(`Error`, `\`\`\`${error}\`\`\``)
                .setTimestamp();
            m.edit({ embeds: [embed] });
        });
    },
};
