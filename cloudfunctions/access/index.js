const cloud = require('wx-server-sdk');

cloud.init({
  traceUser: true,
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const accessTable = db.collection("access");
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.getList == true) {
    try {
      return await accessTable.get({
        success: (res) => {
          if (res && res.length > 0) {
            return res;
          }
          return [];
        }
      });
    } catch (e) {
      console.error('access-getList----0', e)
    }
  }
}