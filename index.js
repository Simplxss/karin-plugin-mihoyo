import { logger } from '#Karin'
import { basename } from './lib/imports/dir.js'
import Config from './lib/config/config.js'

logger.info(`${logger.violet(`[插件:${Config.package.version}]`)} ${logger.green(basename)} 初始化完成~`)
