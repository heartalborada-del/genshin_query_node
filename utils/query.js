const http = require('./http')
const DS = require("./DS")
const NodeCache = require("node-cache")
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const roleIdCache = new NodeCache({stdTTL: 60 * 60 * 12})
const userInfoCache = new NodeCache({stdTTL: 60 * 60})
class CN {
    HEADERS = {
        'User-Agent': UA,
        'x-rpc-client_type': '5',
        'x-rpc-app_version': '2.11.1',
        'DS': '',
        'Cookie': process.env.CNCookie
    }
    TAKUMI_URL = "https://api-takumi-record.mihoyo.com/"
    UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.11.1"
    getRoleInfo = (uid) => {
        const key = `__uid__${uid}`
        return new Promise((resolve, reject) => {
            let cache = roleIdCache.get(key)
            if (cache){
                const {game_role_id, nickname, region, region_name} = cache
                logger.info('从缓存中获取对应玩家信息,uid %s, game_role_id %s, nickname %s, region %s, region_name %s', uid, game_role_id, nickname, region, region_name)
                resolve(cache)
            } else {
                const query = {uid}
                http({
                    method: "GET",
                    url: this.TAKUMI_URL+"game_record/app/card/wapi/getGameRecordCard",
                    query,
                    headers: {
                        ...HEADERS,
                        'DS': DS.getCNDS(query)
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if(response.retcode === 0) {
                        if(response.data.list && response.data.list.length > 0){
                            const roleInfo = response.data.list.find(_ => _.game_id === 2)
                            if (!roleInfo){
                                logger.warn('无角色数据, uid %s', uid)
                                reject('无角色数据，请检查输入的米哈游通行证ID是否有误（非游戏内的UID）和是否设置了公开角色信息，若操作无误则可能是被米哈游屏蔽，请第二天再试')
                            }
                            const { game_role_id, nickname, region, region_name } = roleInfo
                            logger.info('首次获取角色信息, uid %s, game_role_id %s, nickname %s, region %s, region_name %s', uid, game_role_id, nickname, region, region_name)
                            roleIdCache.set(key, roleInfo)
                            resolve(roleInfo)
                        } else {
                            logger.warn('无角色数据, uid %s', uid)
                            reject('无角色数据，请检查输入的米哈游通行证ID是否有误（非游戏内的UID）和是否设置了公开角色信息，若操作无误则可能是被米哈游屏蔽，请第二天再试')
                        }
                    } else {
                        logger.error('获取角色ID接口报错 %s', response.message)
                        reject(response.message)
                    }
                }).catch(error => {
                    logger.error('获取角色ID接口请求报错 %o', err)
                })
            }
        })
    }
    getUserInfo = ({uid}) => {
        const key= `__uid__${uid}`
        return new Promise((resolve,reject) => {
            let cache = userInfoCache.get(key)
            if (cache) {
                if(cache.retcode === 10101) {
                    reject(cache.message)
                } else {
                    resolve(cache)
                }
                return
            } else {
                this.getRoleInfo(uid).then(roleInfo => {
                    const { game_role_id, region } = roleInfo
                    const query = { role_id: game_role_id, server: region }
                    http({
                        method: 'GET',
                        url: this.TAKUMI_URL+"game_record/genshin/api/index",
                        query,
                        headers: {
                            ...this.HEADERS,
                            'DS': DS.getCNDS(query)
                        }
                    }).then(response => {
                        const {stats,world_explorations,homes} = response.data
                        /*
                            anemoculus_number,geoculus_number,electroculus_number,
                            way_point_number,domain_number,
                            luxurious_chest_number,precious_chest_number,
                            exquisite_chest_number,common_chest_number,magic_chest_number,
                            active_days,achievement_number,avatar_number,spiral_abyss
                        */
                        const [anemoculus_number,geoculus_number,electroculus_number,
                            way_point_number,domain_number,
                            luxurious_chest_number,precious_chest_number,
                            exquisite_chest_number,common_chest_number,magic_chest_number,
                            active_days,achievement_number,avatar_number,spiral_abyss] = stats
                        const summary = {
                            'anemoculus_number': anemoculus_number,
                            'geoculus_number': geoculus_number,
                            'electroculus_number': electroculus_number,
                            'way_point_number': way_point_number,
                            'domain_number': domain_number,
                            'luxurious_chest_number': luxurious_chest_number,
                            'precious_chest_number': precious_chest_number,
                            'exquisite_chest_number': exquisite_chest_number,
                            'common_chest_number': common_chest_number,
                            'magic_chest_number': magic_chest_number,
                            'active_days': active_days,
                            'achievement_number': achievement_number,
                            'avatar_number': avatar_number,
                            'spiral_abyss': spiral_abyss
                        }
                    })
                })
            }
        })
    }
}
