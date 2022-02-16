const exp = require('express')
const app = exp()
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const isNumber = require('is-number')

app.get('/', async function(req, res) {
  const config = convertStringInObjectToNumber(req.query)
  if (!(config.w && config.h)) {
    res.status(400).send('Missing width(w) and/or height(h) parameters.')
  } else {
    if (!config.options) config.options = {}
    const chartNode = new ChartJSNodeCanvas(config.w, config.h)

    const buffer = await chartNode.renderToBuffer(config);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length
    })
    res.send(buffer)
  }
})

function convertStringInObjectToNumber(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = strToNum(obj[key])
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(convertStringInObjectToNumber)
    } else if (typeof obj[key] === 'object') {
      obj[key] = convertStringInObjectToNumber(obj[key])
    }
  }

  return obj
}

function strToNum(item) {
  if ((typeof item === 'string') && isNumber(item)) {
    return Number(item)
  } else {
    return item
  }
}

app.listen(process.env.PORT || 3000)
