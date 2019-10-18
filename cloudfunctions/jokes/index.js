const cloud = require('wx-server-sdk');

cloud.init({
  traceUser: true,
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const jokesTable = db.collection("jokes");
const _ = db.command;
let MAX_LIMIT = 20;

exports.main = async (event, context) => {
  if (event.getList == true) {
    let condition = {};

    let types = event.types ? event.types : [0, 1, 2, 3];
    condition['type'] = _.in(types);

    if (event.maxLimit) {
      MAX_LIMIT = event.maxLimit;
    }

    if (event.cont) {
      condition['cont'] = db.RegExp({
        regexp: `.*${event.cont}`,
        options: 'i'
      })
    }

    try {
      return await jokesTable.where(_.and([ condition ]))
        .orderBy('likes', 'desc')
        .orderBy('createTime', 'desc')
        .skip(event.offset)
        .limit(MAX_LIMIT)
        .get({
          success: (res) => {
            if (res && res.length > 0) {
              return res;
            }
            return [];
          }
        });
    } catch (e) {
      console.error('jokes-getList----0', e);
    }
  } else if (event.updateJokes == true) {
    try {
      return await jokesTable.doc(event.jokeId).update({
        data: {
          likes: _.inc(1)
        }
      });
    } catch(e) {
      console.error('jokes-updateJokeWithId----0', e)
    }
  } else if (event.getByIds == true) {
    try {
      return await jokesTable.where({
          _id: _.in(event.ids)
        })
        .orderBy('likes', 'desc')
        .skip(event.offset)
        .limit(MAX_LIMIT)
        .get({
          success: (res) => {
            if (res && res.length > 0) {
              return res;
            }
            return [];
          }
        })
    } catch (e) {
      console.error('jokes-getByIds----0', e);
    }
  } else if (event.getByUserId == true) {
    try {
      return await jokesTable.where({
        userId: event.userId
      })
      .orderBy('likes', 'desc')
      .get({
        success: (res) => {
          if (res && res.length > 0) {
            return res;
          }
          return [];
        }
      })
    } catch (e) {
      console.error('jokes-getByIds----0', e);
    }
  } else if (event.add == true) {
    try {
      return await jokesTable.add({
        data: {
          cont: event.cont,
          createTime: db.serverDate(),
          userId: event.userId,
          likes: 0,
          type: event.type
        }
      });
    } catch (e) {
      console.error('jokes-add----0', e);
    }
  }
}