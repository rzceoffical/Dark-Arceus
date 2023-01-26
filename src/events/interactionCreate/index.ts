import help from './help'
import { Event } from '../../types'
import commands from './commands'

const events: Event<any>[] = [commands, help]

export default events
