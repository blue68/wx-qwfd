const cloud = require('wx-server-sdk');

cloud.init({
  traceUser: true,
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const usersTable = db.collection("userinfo");
const _ = db.command;

/**
 * 这个示例将经自动鉴权过的小程序用户 openId 返回给小程序端
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
  console.log(event);
  console.log(context);

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext();

  // 更新当前信息
  if (event.update == true) {
    try {
      return await usersTable.doc(event.userId).update({
        data: {
          userData: _.set(event.userData),
          phone: _.set(event.phone)
        }
      });
    } catch (e) {
      console.error('login-update----0', e);
    }
  } else if (event.getSelf == true) {
    try {
      return await usersTable.where({
        openId: wxContext.OPENID
      }).get({
        success: (res) => {
          if(res && res.length > 0) {
            return res[0];
          }
          return null;
        }
      });
    } catch (e) {
      console.error('login-getSelf----0', e);
    }

  } else if (event.setSelf == true) {
    try {
      let _data = {
        openId: wxContext.OPENID,
        userData: event.userData,
        phone: "",
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      };
      return await usersTable.add({
        data: _data
      }).then(e => {
        if (e.errMsg == 'collection.add:ok') {
          _data['userId'] = e._id
        }
        return _data;
      }).catch(console.error)

    } catch (e) {
      console.error('login-setSelf----0', e);
    }
  } else if (event.getOthers == true) {
    //获取指定用户信息
    try {
      return await usersTable.where({
        openId: event.openId
      }).get({
        success: (res) => {
          if(res && res.length > 0) {
            return res[0];
          }
          return null;
        }
      });
    } catch (e) {
      console.error('login-getOthers----0', e)
    }
  }
}

