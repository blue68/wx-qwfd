const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  switch (event.action) {
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    default: {
      return
    }
  }
}

async function getWXACode(event) {
  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })
  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'
  const uploadResult = await cloud.uploadFile({
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    fileContent: wxacodeResult.buffer,
  });

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }
  return uploadResult.fileID
}

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  });
}
