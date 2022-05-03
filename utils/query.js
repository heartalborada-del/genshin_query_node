const http = require('./http')
const DS = require("./DS")
const pino = require("pino")
const NodeCache = require("node-cache")
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

const roleIdCache = new NodeCache({ stdTTL: 60 * 60 * 12 })
const userInfoCache = new NodeCache({ stdTTL: 60 * 60 })
const spiralAbyssCache = new NodeCache({ stdTTL: 60 * 30 })
class CN {
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.27.1',
        'x-rpc-client_type': '5',
        'x-rpc-app_version': '2.27.1',
        'Referer': 'https://webstatic.mihoyo.com/',
        'DS': '',
        'Cookie': process.env.CNCookie
    }
    TAKUMI_URL = "https://api-takumi-record.mihoyo.com/"
    getRoleInfo = ({ uid }) => {
        const key = `__uid__${uid}`
        return new Promise((resolve, reject) => {
            let cache = roleIdCache.get(key)
            if (cache) {
                const { game_role_id, nickname, region, region_name } = cache
                logger.info('从缓存中获取对应玩家信息,uid %s, game_role_id %s, nickname %s, region %s, region_name %s', uid, game_role_id, nickname, region, region_name)
                resolve(cache)
            } else {
                const query = { uid }
                http({
                    method: "GET",
                    url: this.TAKUMI_URL + "game_record/app/card/wapi/getGameRecordCard",
                    qs: query,
                    headers: {
                        ...this.HEADERS,
                        'DS': DS.getCNDS(query)
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if (response.retcode === 0) {
                        if (response.data.list && response.data.list.length > 0) {
                            const roleInfo = response.data.list.find(_ => _.game_id === 2)
                            if (!roleInfo) {
                                logger.warn('无角色数据, uid %s', uid)
                                reject('no data')
                            }
                            const { game_role_id, nickname, region, region_name } = roleInfo
                            logger.info('首次获取角色信息, uid %s, game_role_id %s, nickname %s, region %s, region_name %s', uid, game_role_id, nickname, region, region_name)
                            const info = {
                                game_role_id,
                                nickname,
                                region,
                                region_name
                            }
                            roleIdCache.set(key, info)
                            resolve(info)
                        } else {
                            logger.warn('无角色数据, uid %s', uid)
                            reject('no data')
                        }
                    } else {
                        logger.error('获取角色ID接口报错 %s', response.message)
                        reject(response.message)
                    }
                }).catch(error => {
                    logger.error('获取角色ID接口请求报错 %o', error)
                    reject(error)
                })
            }
        })
    }
    getUserInfo = ({ uid, region }) => {
        const key = `__uid-region__${uid}-${region}`
        return new Promise((resolve, reject) => {
            let cache = userInfoCache.get(key)
            if (cache) {
                if (cache.retcode === 10101) {
                    reject(cache.message)
                } else {
                    resolve(cache)
                }
                return
            } else {
                const query = { role_id: uid, server: region }
                http({
                    method: 'GET',
                    url: this.TAKUMI_URL + "game_record/app/genshin/api/index",
                    qs: query,
                    headers: {
                        ...this.HEADERS,
                        'DS': DS.getCNDS(query)
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if (response.retcode !== 0) {
                        logger.warn('获取角色数据接口请求报错 %s', response.message)
                        reject(response.message)
                        return
                    }
                    const data = {
                        uid: uid,
                        retcode: response.retcode,
                        message: response.messages,
                        ...new bulid().bulidUserInfo({json: response})
                    }
                    userInfoCache.set(key,data)
                    resolve(data)
                }).catch((error) => {
                    logger.error('获取角色接口请求报错 %o', error)
                    reject(error)
                })
            }
        })
    }
    getSpiralAbyss = ({ uid, schedule_type, region }) => {
        const key = `__uid-st-r__${uid}-${schedule_type}-${region}`
        return new Promise((resolve, reject) => {
            let cache = spiralAbyssCache.get(key)
            if (cache) {
                if (cache.retcode === 10101) {
                    reject(cache.message)
                } else {
                    resolve(cache)
                }
                return
            } else {
                const query = {'role_id': uid, schedule_type,'server': region}
                http({
                    method: 'GET',
                    url: this.TAKUMI_URL+'game_record/app/genshin/api/spiralAbyss',
                    qs: query,
                    headers: {
                        ...this.HEADERS,
                        'DS': DS.getCNDS(query)
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if (response.retcode !== 0) {
                        logger.warn('获取深渊数据接口请求报错 %s', response.message)
                        reject(response.message)
                        return
                    }
                    const data = {
                        uid: uid,
                        retcode: response.retcode,
                        message: response.messages,
                        ...new bulid().bulidSpiralAbyss({'json': response})
                    }
                    userInfoCache.set(key, data)
                    resolve(data)
                }).catch((error) => {
                    logger.error('获取深渊数据接口请求报错 %o', error)
                    reject(error)
                })
            }
        })
    }
}
class OS {
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'x-rpc-client_type': '4',
        'x-rpc-app_version': '1.5.0',
        'Referer': 'https://webstatic-sea.mihoyo.com/',
        'DS': '',
        'Cookie': process.env.OSCookie
    }
    TAKUMI_URL = "https://bbs-api-os.hoyolab.com/"
    getRoleInfo = ({ uid }) => {
        const key = `__uid__${uid}`
        return new Promise((resolve, reject) => {
            let cache = roleIdCache.get(key)
            if (cache) {
                const { game_role_id, nickname, region, region_name } = cache
                logger.info('从缓存中获取对应玩家信息,uid %s, game_role_id %s, nickname %s, region %s, region_name %s', uid, game_role_id, nickname, region, region_name)
                resolve(cache)
            } else {
                const query = { uid }
                http({
                    method: "GET",
                    url: this.TAKUMI_URL + "game_record/card/wapi/getGameRecordCard",
                    qs: query,
                    headers: {
                        ...this.HEADERS,
                        'DS': DS.getOSDS()
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if (response.retcode === 0) {
                        if (response.data.list && response.data.list.length > 0) {
                            const roleInfo = response.data.list.find(_ => _.game_id === 2)
                            if (!roleInfo) {
                                logger.warn('无角色数据, uid %s', uid)
                                reject('no data')
                            }
                            const { game_role_id, nickname, region, region_name } = roleInfo
                            logger.info('首次获取角色信息, uid %s, game_role_id %s, nickname %s, region %s, region_name %s', uid, game_role_id, nickname, region, region_name)
                            const info = {
                                game_role_id,
                                nickname,
                                region,
                                region_name
                            }
                            roleIdCache.set(key, info)
                            resolve(info)
                        } else {
                            logger.warn('无角色数据, uid %s', uid)
                            reject('no data')
                        }
                    } else {
                        logger.error('获取角色ID接口报错 %s', response.message)
                        reject(response.message)
                    }
                }).catch(error => {
                    logger.error('获取角色ID接口请求报错 %o', error)
                    reject(error)
                })
            }
        })
    }
    getUserInfo = ({ uid, region }) => {
        const key = `__uid-region__${uid}-${region}`
        return new Promise((resolve, reject) => {
            let cache = userInfoCache.get(key)
            if (cache) {
                if (cache.retcode === 10101) {
                    reject(cache.message)
                } else {
                    resolve(cache)
                }
                return
            } else {
                const query = { role_id: uid, server: region }
                http({
                    method: 'GET',
                    url: this.TAKUMI_URL + "game_record/genshin/api/index",
                    qs: query,
                    headers: {
                        ...this.HEADERS,
                        'DS': DS.getOSDS()
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if (response.retcode !== 0) {
                        logger.warn('获取角色数据接口请求报错 %s', response.message)
                        reject(response.message)
                        return
                    }
                    const data = {
                        uid: uid,
                        retcode: response.retcode,
                        message: response.messages,
                        ...new bulid().bulidUserInfo({json: response})
                    }
                    userInfoCache.set(key,data)
                    resolve(data)
                }).catch((error) => {
                    logger.error('获取角色接口请求报错 %o', error)
                    reject(error)
                })
            }
        })
    }
    getSpiralAbyss = ({ uid, schedule_type, region }) => {
        const key = `__uid-st-r__${uid}-${schedule_type}-${region}`
        return new Promise((resolve, reject) => {
            let cache = spiralAbyssCache.get(key)
            if (cache) {
                if (cache.retcode === 10101) {
                    reject(cache.message)
                } else {
                    resolve(cache)
                }
                return
            } else {
                const query = {'role_id': uid, schedule_type,'server': region}
                http({
                    method: 'GET',
                    url: this.TAKUMI_URL+'game_record/genshin/api/spiralAbyss',
                    qs: query,
                    headers: {
                        ...this.HEADERS,
                        'DS': DS.getOSDS()
                    }
                }).then(response => {
                    response = JSON.parse(response)
                    if (response.retcode !== 0) {
                        logger.warn('获取深渊数据接口请求报错 %s', response.message)
                        reject(response.message)
                        return
                    }
                    const data = {
                        uid: uid,
                        retcode: response.retcode,
                        message: response.messages,
                        ...new bulid().bulidSpiralAbyss({'json': response})
                    }
                    userInfoCache.set(key, data)
                    resolve(data)
                }).catch((error) => {
                    logger.error('获取深渊数据接口请求报错 %o', error)
                    reject(error)
                })
            }
        })
    }
}

class bulid {
    bulidUserInfo = ({ json }) => {
        const {stats, world_explorations, homes } = json.data
        const {anemoculus_number, geoculus_number, electroculus_number,
            way_point_number, domain_number,
            luxurious_chest_number, precious_chest_number,
            exquisite_chest_number, common_chest_number, magic_chest_number,
            active_days, achievement_number, avatar_number, spiral_abyss} = stats
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
        var worldExploration = []
        for (var i in world_explorations) {
            var offeringName = ''
            var offeringLevel = ''
            var offeringIcon = ''
            if (world_explorations[i].offerings == {}) {
                offeringName = world_explorations[i][0].name
                offeringLevel = world_explorations[i][0].level
                offeringIcon = world_explorations[i][0].icon
            }
            worldExploration[i] = {
                'world': world_explorations[i].name,
                'level': world_explorations[i].level,
                'exp': world_explorations[i].exploration_percentage / 10,
                'icon': world_explorations[i].inner_icon,
                'cover': world_explorations[i].cover,
                'offering': {
                    'offering_name': offeringName,
                    'offering_level': offeringLevel,
                    'offering_icon': offeringIcon
                }
            }
        }
        var sereniteaPot = []
        for (var i in homes) {
            sereniteaPot[i] = {
                'world': homes[i].name,
                'level': homes[i].level,
                'comfort_num': homes[i].comfort_num,
                'item_num': homes[i].item_num,
                'visit_num': homes[i].visit_num,
                'comfort_level_icon': homes[i].comfort_level_icon
            }
        }
        const data = {
            summary,
            worldExploration,
            sereniteaPot
        }
        return data
    }
    bulidSpiralAbyss = ({ json }) => {
        console.log(json)
        const {
            schedule_id, max_floor, start_time, end_time,
            total_battle_times, total_win_times,
            reveal_rank, defeat_rank, damage_rank, take_damage_rank,
            normal_skill_rank, energy_skill_rank
        } = json.data
        var rankSummary = {reveal:{}, defeat:{}, takeDamage:{}, normalSkill:{}, energrySkill:{} }
        const rank = [
            reveal_rank, defeat_rank, damage_rank, take_damage_rank,
            normal_skill_rank, energy_skill_rank
        ]
        for (var o in rank) {
            for (var i in rank[o]) {
                rankSummary[o][i]= {
                    name: rank[o][i].avatar_url,
                    value: rank[o][i].value,
                    rarity: rank[o][i].rarity
                }
            }
        }
        const summary = {
            schedule_id, max_floor, start_time, end_time,
            total_battle_times, total_win_times,
        }
        const data = {
            ...summary,
            ...rankSummary
        }
        return data
    }
}

module.exports = {
    CN
    OS
}
