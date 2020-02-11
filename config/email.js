const path = require('path')
const sendgrid = require('@sendgrid/mail')
let config
try {
  config = require(path.resolve(__dirname, './private-config.json'))
} catch (err) {
  config = undefined
}
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY)
sendgrid.setSubstitutionWrappers('{{', '}}')

const email = {
  sendTemplate(options) {
    options = options || {}
    if (!options.template_id || !options.message) {
      return Promise.reject('Missing required option')
    }

    const templateOptions = {
      from: {
        email: 'hello@thegeekdeveloper.com',
        name: 'Movies4U Support'
      },
      reply_to: {
        email: 'hello@thegeekdeveloper.com',
        name: 'Movies4U Support'
      },
      personalizations: [
        {
          to: [
            {
              email: options.message.to.email,
              name: options.message.to.name
            }
          ],
          dynamic_template_data: options.message.dynamicData
        }
      ],
      template_id: options.template_id
    }

    return new Promise((resolve, reject) => {
      sendgrid.send(templateOptions, resolve, reject)
    })
  }
}

module.exports = email
