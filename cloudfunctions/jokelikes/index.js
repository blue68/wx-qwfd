const cloud = require('wx-server-sdk');

cloud.init({
  traceUser: true,
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const likesTable = db.collection("jokelikes");
const _ = db.command;
const MAX_LIMIT = 20;

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.getList == true) {
    const resultCount = await likesTable.count();
    const total = resultCount.total;

    try {
      return await likesTable.where({
        userId: event.userId
      }).field({
        jokeId: true,
        _id: true
      }).skip(event.offset).limit(MAX_LIMIT).get({
        success: (res) => {
          if (res && res.length > 0) {
            return res;
          }
          return [];
        }
      });
    } catch (e) {
      console.error('likes-getList----0', e)
    }
  } else if (event.setSelf == true) {
    try {
      let _data = {
        userId: event.userId,
        jokeId: event.jokeId,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      };
      return await likesTable.add({
        data: _data
      }).then(e => {
        return _data;
      }).catch(console.error)
    } catch (e) {
      console.error('likes-setSelf----0', e);
    }
  } else if (event.remove == true) {
    try {
      return await likesTable.doc(event.likeId).remove()
        .then(d => {
          return d;
        }).catch(console.error);
    } catch (e) {
      console.error('likes-remove----0', e);
    }
  }
}