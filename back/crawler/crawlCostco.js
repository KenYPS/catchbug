const request = require('request')
const cheerio = require('cheerio')
const globalStore = require('../store')
const getStockStatusChangeList = require('./checkStockStatusChange')
const fetch = require('node-fetch')

const iteralList = async (list=[]) => {
  let lists = await Promise.all(list.map(crawl))
  lists = lists.filter((v) => v)
  const preItemList = globalStore.itemLists
  getStockStatusChangeList(preItemList, lists)
  globalStore.itemLists = lists
  return lists
}
const startCrawler = (list = []) => {
  iteralList(list)
  setInterval(()=>iteralList(list), 3 * 60 * 1000)
}

function checkIfItemNumCanBeCrawled(params) {
  const url = `https://www.costco.com.tw/search?text=${itemNum}`
  return new Promise((resolve) => {
    request({ url }, (error, response, body) =>
      getCostcoItemLink(error, body, itemNum, resolve)
    )
  })
}

async function crawl(itemNum = Number) {
  // get item info and url
  const url = `https://www.costco.com.tw/rest/v2/taiwan/products/search?fields=FULL&query=${itemNum}&pageSize=300&lang=zh_TW&curr=TWD`
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
     const productDetail = data.products.filter((v) => {
       return v.code.includes(itemNum.toString())})[0]
      if (productDetail) {
        const itemName = productDetail.name
        const itemImg = productDetail.images[0].url
        const itemLink = productDetail.url
        const itemNum = productDetail.code
        const itemStockStatus =
          productDetail.stock.stockLevelStatus === 'inStock' ? true : false
        const itemPrice = itemStockStatus ? productDetail.price.value : false
        const itemData = {
          itemImg: `https://www.costco.com.tw${itemImg}`,
          itemName,
          itemPrice,
          itemStockStatus,
          itemLink: `https://www.costco.com.tw${itemLink}`,
          itemNum,
        }
        return itemData
      }
      return false
    })
}

module.exports = startCrawler
