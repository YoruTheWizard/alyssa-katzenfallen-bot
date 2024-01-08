const { ApplicationCommandOptionType, Client, EmbedBuilder } = require('discord.js');
const { getTitlesChoices, getTitlesList, listTreater, errorLogger } = require('../../../util/utils');

module.exports = {
  staffOnly: true,
  data: {
    name: 'recrutamento',
    description: '[Staff] Envia uma mensagem de recrutamento para todos no servidor',
    options: [
      {
        name: 'obra',
        description: 'Obra na qual precisa-se de ajuda',
        type: ApplicationCommandOptionType.String,
        choices: getTitlesChoices(),
        required: true
      },
      {
        name: 'cargos',
        description: 'Cargos requisitados',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'requisitos',
        description: 'Requisitos para o recrutamento',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'link-thumbnail',
        description: 'Imagem que fica ao lado no embed',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'comentario',
        description: 'Mais informações sobre o anúncio',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'contato',
        description: 'Informações de contato',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'imagem',
        description: 'Arquivo da imagem do anúncio',
        type: ApplicationCommandOptionType.Attachment,
      },
      {
        name: 'link-imagem',
        description: 'Link da imagem do anúncio',
        type: ApplicationCommandOptionType.String
      }
    ],
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
      roles = listTreater(interaction.options.get('cargos').value),
      requirements = listTreater(interaction.options.get('requisitos').value),
      thumbnail = interaction.options.get('link-thumbnail')?.value,
      comment = interaction.options.get('comentario')?.value,
      contact = interaction.options.get('contato')?.value,
      image = interaction.options.getAttachment('imagem')
        || interaction.options.get('link-imagem')?.value;

    const titles = getTitlesList();
    let titleObj;
    for (let title of titles)
      if (title.id === titleId) titleObj = title;

    if (!titleObj) {
      interaction.reply({
        content: 'Epa! Essa obra não está registrada!',
        ephemeral: true
      });
      return;
    }

    try {
      const recruitmentEmbed = new EmbedBuilder()
        .setTitle('Estamos recrutando!')
        .setDescription(`**Olá Min\'na-san! Estamos precisando de ajuda em ${titleObj.name}**`)
        .setFields(
          {
            name: '**Cargos**',
            value: roles
          },
          {
            name: '**Requisitos**',
            value: requirements
          }
        );

      if (thumbnail)
        recruitmentEmbed.setThumbnail(thumbnail);

      if (comment)
        recruitmentEmbed.addFields({
          name: '**Mais informações**',
          value: `**${comment}**`
        });

      if (contact)
        recruitmentEmbed.addFields({
          name: '**Contato**',
          value: `**${contact}**`
        });

      if (image)
        recruitmentEmbed.setImage(image?.url ? image.url : image);

      recruitmentEmbed.setFooter({
        text: 'Katzenfallen',
        iconURL: interaction.guild.iconURL()
      });

      interaction.channel.send({ content: '@everyone', embeds: [recruitmentEmbed] });
      interaction.reply({ content: 'Mensagem enviada!', ephemeral: true });
    } catch (err) {
      errorLogger('recruitment', err);
    }
  }
};