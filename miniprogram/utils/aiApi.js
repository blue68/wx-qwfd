const AI_PREFIX = "https://api.ai.qq.com/fcgi-bin/";

module.exports = {
  "nlp_textchat":  AI_PREFIX + "nlp/nlp_textchat", // 智能闲聊
  "vision_imgtotext":  AI_PREFIX + "vision/vision_imgtotext", // 看图说话
  "image_fuzzy": "image_fuzz AI_PREFIX + yimage/image_fuzzy",// 模糊图片识别
  "image_food":  AI_PREFIX + "image/image_food", // 美食图片识别
  "vision_scener":  AI_PREFIX + "vision/vision_scener", // 场景识别
  "vision_objectr":  AI_PREFIX + "vision/vision_objectr", // 物体识别
  "nlp_imagetranslate":  AI_PREFIX + "nlp/nlp_imagetranslate", // 图片翻译,
  "nlp_speechtranslate": AI_PREFIX + "nlp/nlp_speechtranslate", // 语音翻译
  "nlp_texttranslate": AI_PREFIX + "nlp/nlp_texttranslate" // 文本翻译(翻译君)
}