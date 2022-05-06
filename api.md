### POST https://webapi.account.mihoyo.com/Api/login_by_password

传入参数
| 参数 | 描述 | 获取方法 |
| ------ | ------ | ------ |
| account | 手机号/邮箱 | 用户输入 |
| password | 加密后密码 | 未找到获取方法 |
| mmt_key | mmt_key | 在下文有获取方法 |
| is_crypto | 是否加密 | 为true |
| geetest_challenge| challenge | 在下文有获取方法 |
| geetest_validate | validate | 在下文有获取方法 |
| geetest_seccode | seccode | validate + &#124;jordan |
| source | 访问地址 | 当前访问地址 |
| t | 时间戳 | 时间戳 |

返回值
| 参数 | 描述 |
| ------ | ------ |
| code | 代码 |
| data | 数据 |

data下数据
| 参数 | 描述 |
| ------ | ------ |
| account_info | 账户信息 |
| msg | 信息 |
| status | 代码 |
### GET https://webapi.account.mihoyo.com/Api/create_mmt
传入参数
| 参数 | 描述 | 获取方法 |
| ------ | ------ | ------ |
| scene_type | 未知 | 默认为1 |
| now | 时间戳 | 时间戳 |
| t | 时间戳 | 时间戳 |
| reason | 登陆后跳转的位置 | 默认可填'user.mihoyo.com%23%2Flogin%2Fcaptcha' |

返回值
| 参数 | 描述 |
| ------ | ------ |
| code | 代码 |
| data | 数据,下有mmt_data |

data下数据
| 参数 | 描述 |
| ------ | ------ |
| mmt_type | mmt类型 |
| msg | 信息 |
| status | 代码 |
| scene_type | 未知 |
| mmt_data | 请查阅下文 |

mmt_data下数据
| 参数 | 描述 |
| ------ | ------ |
| challenge | 极验challenge |
| gt | 极验gt |
| mmt_key | mmt_key |
| new_captcha | 一般为1 |
| success | 一般为1 |
### GET https://webapi.account.mihoyo.com/Api/login_by_cookie
GET t为时间戳

GET 内有验证码参数
### GET https://webapi.account.mihoyo.com/Api/groupbindinfo_by_loginticket
GET t为时间戳