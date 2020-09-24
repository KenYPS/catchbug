const { admin } = require('./firebase')
const startCrawler = require('./crawler')
const rootRef = admin.database().ref()

// listen value from firebase
module.exports = rootRef.on('value', snapshot => {
    const val = snapshot.val()
    let crawlerList = []
    for (const key in val) {
        for (const user in val[key]) {
            crawlerList = [...val[key][user],...crawlerList]
        }
    }
    const filteredList = new Set(crawlerList)
    const ListArray = [...filteredList]
    startCrawler(ListArray)
})

