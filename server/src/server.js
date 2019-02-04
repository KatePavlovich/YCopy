'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const config = require('./config')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/subscribe', (req, res) => {
  const { body } = req

  if (!body) {
    return res.status(401).send
  }

  const { mailchimpInstance, listUniqueId, mailchimpApiKey } = body

  request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
    .send({
      email_address: (body && body.email) || '',
      status: 'subscribed',
      merge_fields: {},
    })
    .end(function(err, response) {
      let detail = response.body.detail

      if (response.body.title === 'Member Exists') {
        detail = 'This email is already subscribed.'
      }

      if (response.body.title === 'Invalid Resource') {
        detail = 'This email looks like fake or invalid.'
      }

      res.send(
        JSON.stringify({
          detail,
          status: response.body.status,
        }),
      )
    })
})

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})
