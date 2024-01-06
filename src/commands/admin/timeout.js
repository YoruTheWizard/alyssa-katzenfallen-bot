const { ApplicationCommandOptionType, PermissionFlagsBits, Client } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: {
    name: 'silenciar',
    description: '[ADM] Silencia um usuário por um tempo determinado',
    options: [
      {
        name: 'usuario',
        description: 'Usuário a ser silenciado',
        type: ApplicationCommandOptionType.Mentionable,
        required: true
      },
      {
        name: 'duracao',
        description: 'Duração do castigo (30m, 1h, 1 dia...)',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'razao',
        description: 'Razão pela qual o usuário foi silenciado',
        type: ApplicationCommandOptionType.String
      }
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers]
  },

  /**
   * 
   * @param {{
   * interaction: import('discord.js').Interaction,
   * client: Client
   * }} param0 
   */
  run: async ({ interaction, client }) => {
    const memberId = interaction.options.get('usuario').value,
      duration = interaction.options.get('duracao').value.replace('dia', 'day'),
      reason = interaction.options.get('razao')?.value;
    const member = interaction.guild.members.cache.get(memberId);

    if (!member) {
      interaction.reply({ content: 'Esse usuário não existe!', ephemeral: true });
      return;
    }
    if (member.id === interaction.guild.ownerId) {
      interaction.reply({ content: 'Esse usuário não pode ser silenciado pois é o dono do servidor!', ephemeral: true });
      return;
    }

    const msDuratrion = ms(duration);
    if (isNaN(msDuratrion)) {
      await interaction.reply({ content: 'Duração do silêncio inválida!', ephemeral: true });
      return;
    }
    if (msDuratrion < 5000 || msDuratrion > 2.419e9) {
      await interaction.reply({ content: 'A duração do silêncio deve estar entre 5 segundos e 28 dias!', ephemeral: true });
      return;
    }

    const memberRolePosition = member.roles.highest.position,
      requestUserRolePosition = interaction.member.roles.highest.position,
      botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (memberRolePosition >= requestUserRolePosition) {
      await interaction.reply({ content: 'Você não pode silenciar esse usuário pois possui mesmo cargo ou um cargo maior que o seu!', ephemeral: true });
      return;
    }
    if (memberRolePosition >= botRolePosition) {
      await interaction.reply({ content: 'Eu não posso silenciar esse usuário pois possui o mesmo cargo/um cargo maior que o meu!', ephemeral: true });
      return;
    }

    try {
      const { default: prettyMs } = await import('pretty-ms');
      if (member.isCommunicationDisabled()) {
        await member.timeout(msDuratrion, reason);
        interaction.reply(`O castigo de ${member} foi modificado para ${prettyMs(msDuratrion, { verbose: true })
          .replace('second', 'segundo')
          .replace('minute', 'minuto')
          .replace('hour', 'hora')
          .replace('day', 'dia')}`);
        return;
      }

      await member.timeout(msDuratrion, reason);
      interaction.reply(
        `**Shhh!** ${member} foi silenciado por ${prettyMs(msDuratrion, { verbose: true })
          .replace('second', 'segundo')
          .replace('minute', 'minuto')
          .replace('hour', 'hora')
          .replace('day', 'dia')
        }.\nRazão: ${reason ? reason : '*nenhuma razão providenciada.*'}`);
    } catch (err) {
      console.error(`There was an error while running command 'timeout': \n${err}`);
    }
  }
};