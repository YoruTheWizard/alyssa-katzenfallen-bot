const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Client } = require('discord.js');
const { getTitlesChoices, getTitlesList, errorLogger } = require('../../../util/utils');

module.exports = {
  staffOnly: true,
  data: {
    name: 'novolancamento',
    description: '[Staff] Envia um anúncio de novo lançamento',
    options: [
      {
        name: 'obra',
        description: 'Nome da obra',
        type: ApplicationCommandOptionType.String,
        choices: getTitlesChoices(),
        required: true
      },
      {
        name: 'tipo',
        description: 'Tipo de lançamento',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Capítulo',
            value: 'capítulo'
          },
          {
            name: 'Volume',
            value: 'volume'
          }
        ],
        required: true
      },
      {
        name: 'numero',
        description: 'Número do lançamento',
        type: ApplicationCommandOptionType.Number,
        required: true
      },
      {
        name: 'links',
        description: 'Links para acessar o lançamento',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'volume',
        description: 'Volume do capítulo',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'imagem',
        description: 'Arquivo da imagem do lançamento',
        type: ApplicationCommandOptionType.Attachment
      },
      {
        name: 'link-imagem',
        description: 'Link da imagem do lançamento',
        type: ApplicationCommandOptionType.String
      }
    ]
  },

  /**
   * 
   * @param {{
   *  interaction: import('discord.js').Interaction,
   *  client: Client
   * }} param0 
   */
  run: ({ interaction, client }) => {
    const titleId = interaction.options.get('obra').value,
      type = interaction.options.get('tipo').value,
      number = interaction.options.get('numero').value,
      linksStr = interaction.options.get('links').value,
      volume = interaction.options.get('volume')?.value,
      image = interaction.options.getAttachment('imagem')
        || interaction.options.get('link-imagem')?.value;

    let titleObj;
    const titles = getTitlesList();
    for (let title of titles)
      if (title.id === titleId) titleObj = title;

    if (!titleObj) {
      interaction.reply({
        content: 'Epa! Essa obra ainda não foi registrada!',
        ephemeral: true
      });
      return;
    }

    let role = interaction.guild.roles.cache.get(titleObj.roleId),
      color;
    if (role) color = role.color;
    else {
      role = '@everyone';
      color = 'Random';
    }

    try {
      const releaseEmbed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: titleObj.nameJP })
        .setTitle(titleObj.fullname)
        .setDescription('**Olá Min\'na-san!**')
        .setFields(
          {
            name: '\u200B',
            value: `**Temos o prazer de anunciar o lançamento ${type} ${number} ${volume ? `do volume ${volume}` : ''} de ${titleObj.name}, agora disponível em uma tradução cuidadosa e envolvente!**`
          },
          {
            name: '\u200B',
            value: `**E não se esqueça de fazer seus comentários no ⁠${titleObj.titleChannel} ficaremos felizes em interagir com vocês!**`
          }
        )
        .setFooter({
          text: 'Katzenfallen',
          iconURL: interaction.guild.iconURL()
        });

      if (image)
        releaseEmbed.setImage(image?.url ? image.url : image);

      interaction.channel.send({ content: `${role}`, embeds: [releaseEmbed] });
      interaction.reply({ content: 'Mensagem enviada!', ephemeral: true });
    } catch (err) {
      errorLogger('new release', err);
    }
  }
};