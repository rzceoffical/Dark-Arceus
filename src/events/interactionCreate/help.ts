import { createId, EditReply, event, readId, Reply } from '../../utils'
import { getCategoryPage, getCategoryRoot, Namespaces } from '../../pages/help'
import { SelectMenuInteraction } from 'discord.js'

export default event(
  'interactionCreate',
  async ({ log, client }, interaction) => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return
    const [namespace] = readId(interaction.customId)

    // If namespace not in help pages stop
    if (!Object.values(Namespaces).includes(namespace)) return
    try {
      // Defer update
      await interaction.deferUpdate()

      switch (namespace) {
        case Namespaces.root:
          return await interaction.editReply(getCategoryRoot())
          break
        case Namespaces.select:
          const newId = createId(
            Namespaces.select,
            (interaction as SelectMenuInteraction).values[0]
          )

          return await interaction.editReply(getCategoryPage(newId))
          break;
        case Namespaces.action:
          return await interaction.editReply(getCategoryPage(interaction.customId))
          break;
        default:
          throw new Error('Invalid namespace reached...')
      }
    } catch (error) {
      log('[Help Error]', error)

      if (interaction.deferred)
        return await interaction.editReply(
          EditReply.error('Something went wrong :(')
        )

      return await interaction.reply(Reply.error('Something went wrong :('))
    }
  }
)
