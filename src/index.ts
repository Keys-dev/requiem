import 'dotenv/config'
import { RequiemClient } from './structs/RequiemClient'

const CLIENT = new RequiemClient

CLIENT.start()