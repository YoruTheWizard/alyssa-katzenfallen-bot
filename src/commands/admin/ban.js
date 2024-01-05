const { Client, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: {
    name: 'banir',
    description: '[ADM] Bane um usuário',
    options: [
      {
        name: 'usuario',
        description: 'Usuário a ser banido',
        type: ApplicationCommandOptionType.Mentionable,
        required: true
      },
      {
        name: 'razao',
        description: 'Razão pela qual o usuário será banido',
        type: ApplicationCommandOptionType.String
      }
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers]
  },

  /**
   * 
   * @param {{
   *  interaction: import('discord.js').Interaction, 
   *  client: Client
   * }} param0
   */
  run: async ({ interaction, client }) => {
    const memberId = interaction.options.get('usuario').value,
      reason = interaction.options.get('razao')?.value;
    const member = interaction.guild.members.cache.get(memberId);

    if (!member) {
      interaction.reply({ content: 'Esse usuário não existe!', ephemeral: true });
      return;
    }
    if (member.id === interaction.guild.ownerId) {
      interaction.reply({ content: 'Esse usuário não pode ser banido pois é o dono do servidor!', ephemeral: true });
      return;
    }

    const memberRolePosition = member.roles.highest.position,
      requestUserRolePosition = interaction.member.roles.highest.position,
      botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (memberRolePosition >= requestUserRolePosition) {
      await interaction.reply({ content: 'Você não pode banir esse usuário pois possui mesmo cargo ou um cargo maior que o seu!', ephemeral: true });
      return;
    }
    if (memberRolePosition >= botRolePosition) {
      await interaction.reply({ content: 'Eu não posso banir esse usuário pois possui o mesmo cargo/um cargo maior que o meu!', ephemeral: true });
      return;
    }

    try {
      await member.ban({ reason });
      interaction.reply(`**Bang!** ${member.user.username} foi banido. Razão: ${reason ? reason : 'nenhuma razão providenciada'}`);
    } catch (err) {
      console.log(`There was an error while running the command 'ban': \n${err}`);
    }
  }
};