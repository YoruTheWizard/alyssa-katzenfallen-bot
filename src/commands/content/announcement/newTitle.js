const { ApplicationCommandOptionType, Client, EmbedBuilder } = require('discord.js');
const { errorLogger, sendEmbeds } = require('../../../util/utils');

module.exports = {
  staffOnly: true,
  data: {
    name: 'novaobra',
    description: '[Staff] Envia um anúncio de nova obra',
    options: [
      {
        name: 'nome',
        description: 'Nome da obra',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'links',
        description: 'Links para acessar a obra',
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: 'link-thumbnail',
        description: 'Imagem que fica ao lado no embed',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'sinopse',
        description: 'Sinopse da obra',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'comentario',
        description: 'Algum comentário sobre a obra',
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'imagem',
        description: 'Arquivo da imagem da obra',
        type: ApplicationCommandOptionType.Attachment,
      },
      {
        name: 'link-imagem',
        description: 'Link da imagem da obra',
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
    const name = interaction.options.get('nome').value,
      linksText = interaction.options.get('links').value.split(', '),
      image = interaction.options.getAttachment('imagem') || interaction.options.get('link-imagem')?.value,
      sinopsys = interaction.options.get('sinopse')?.value,
      description = interaction.options.get('comentario')?.value;

    try {
      const titleEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Nova obra chegando na Katzenfallen!')
        .setDescription(`**Olá Min\'na-san! A partir de hoje teremos uma nova obra no catálogo!\n- Nome: *${name}***`)
        .setThumbnail(interaction.guild.iconURL());

      if (image) titleEmbed.setImage(image?.url ? image.url : image);

      if (sinopsys) titleEmbed.addFields({
        name: 'Sinopse',
        value: sinopsys
      });

      if (description) titleEmbed.addFields({
        name: 'Comentário',
        value: description
      });

      sendEmbeds(interaction, [titleEmbed], true);
    } catch (err) {
      errorLogger('new title', err);
    }
  }
};