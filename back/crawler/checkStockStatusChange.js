const { linebotPushMessage } = require('../linebot/api')
const globalStore = require('../store')

function sendLinebot (params) {
  const { userId, info } = params
  const text = combindText(info)
  const messages = [{
    type: 'text',
    text
  }
  ]
  const data = {
    to: userId,
    messages
  }
  console.log(data);
  linebotPushMessage(data)
}

const combindText = (info) => {
  let text = ''
  for (let index = 0; index < info.length; index++) {
    const { itemStockStatus, itemName, itemLink } = info[index]
    text += itemStockStatus ? `恭喜老爺賀喜夫人，${itemName} 有貨了，手刀下訂去${itemLink}\n` : `QQ ${itemName}沒貨了\n`
  }
  return text
}

async function sendMessageToUser (lineBotPushList) {
  await Promise.all(
    lineBotPushList.map(sendLinebot)
  )
}

function checkUserHasItemInList (stockStatusChangeList) {
  const lineBotPushList = []

  const { userListData } = globalStore
  // see which user has this item
  for (const userId in userListData) {
    const userItemList = userListData[userId]
    const info = getUserPushStockInfoArray(userItemList, stockStatusChangeList)
    if (info.length > 0) {
      lineBotPushList.push({ userId, info })
    }
  }
  if (lineBotPushList.length > 0) {
    sendMessageToUser(lineBotPushList)
  }
}

function getUserPushStockInfoArray (userItemList, stockStatusChangeList) {
  const data = []
  for (let index = 0; index < userItemList.length; index++) {
    const item = userItemList[index]
    for (let j = 0; j < stockStatusChangeList.length; j++) {
      const stockStatusItem = stockStatusChangeList[j]
      const { itemNum } = stockStatusItem
      if (item === itemNum) { data.push(stockStatusItem) }
    }
  }

  return data
}

function getStockStatusChangeList (preItemList = [], newLists = []) {
  const newStatusDiffList = []
  if (preItemList.length>0 && newLists.length>0) {
    for (let index = 0; index < newLists.length; index++) {
      const { itemNum, itemStockStatus, itemName, itemLink } = newLists[index]
      for (let j = 0; j < preItemList.length; j++) {
        const { itemNum: compareItemNum, itemStockStatus: compareItemStockStatus } = preItemList[j]
        if (itemNum === compareItemNum && itemStockStatus !== compareItemStockStatus) {
          newStatusDiffList.push({ itemNum, itemStockStatus: !!itemStockStatus, itemName, itemLink })
        }
      }
    }
  }
  const stockStatusChangeList = [...new Set(newStatusDiffList.filter(v => v.itemNum))]

  if (stockStatusChangeList.length > 0) {
    checkUserHasItemInList(stockStatusChangeList)
  }
}

module.exports = getStockStatusChangeList
