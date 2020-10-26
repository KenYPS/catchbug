const { admin } = require('../firebase')
const globalStore = require('../store')
const startCrawler = require('./crawlCostco')
const rootRef = admin.database().ref()

// listen value from firebase
module.exports = rootRef.on('value', snapshot => {
  const val = snapshot.val()
  let crawlerList = []
  for (const key in val) {
    for (const user in val[key]) {
      crawlerList = [...val[key][user], ...crawlerList]
    }
  }
  globalStore.userListData = val.Costco
  const filteredList = new Set(crawlerList)
  const ListArray = [...filteredList]
  startCrawler(ListArray)
})
