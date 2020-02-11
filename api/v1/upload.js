const express = require('express')
const router = express.Router()
const aws = require('aws-sdk')
const Busboy = require('busboy')
const gm = require('gm')
const async = require('async')
const _ = require('lodash')
const sizeOf = require('image-size')
const fileExtension = require('file-extension')
const config = require('../../config/local-config.json')
const authenticate = require('../../config/authenticate')
const isDev = !(process.env.NODE_ENV === 'production')
const isHerokuServer = !!process.env.HEROKU
let privateConfig
try {
  privateConfig = require('../../config/private-config.json')
} catch (err) {
  privateConfig = undefined
}

router.use(authenticate)

router.post('/thumb', (req, res) => {
  const busboy = new Busboy({
    headers: req.headers
  })
  // The file upload has completed
  busboy.on('finish', () => {
    // Your files are stored in req.files. In this case,
    // Grabs your file object from the request.
    const bucket = new aws.S3({
      params: {
        Bucket: isDev && privateConfig ? privateConfig.S3.BUCKET_NAME : process.env.S3_BUCKET_NAME,
        Region: isDev && privateConfig ? privateConfig.S3.BUCKET_REGION : process.env.S3_BUCKET_REGION
      }
    })

    bucket.name = isDev && privateConfig ? privateConfig.S3.BUCKET_NAME : process.env.S3_BUCKET_NAME

    const imageTest = new RegExp('image\/.*')
    const file = req.files.file || req.files.image

    const params = {
      Key: file.name,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }
    const createMediaFileData = {
      name: file.name,
      contentType: file.mimetype,
      size: file.size
    }

    if (imageTest.test(file.mimetype)) {
      const dimensions = sizeOf(file.data)
      createMediaFileData.originalDimensions = _.pick(dimensions, ['width', 'height'])
    }

    async.parallel([
      function uploadOriginalFile(done) {
        bucket.upload(params, (err, data) => {
          if (err) {
            done()
          }

          createMediaFileData.url = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
          createMediaFileData.link = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${params.Key}`
          done()
        })
      },
      function uploadThumbnail(done) {
        const extension = fileExtension(createMediaFileData.name)

        if (!isHerokuServer) {
          return gm(params.Body, createMediaFileData.name)
            .setFormat(extension)
            .quality('90')
            .gravity('Center')
            .crop('640', '640')
            .stream((err, stdout, stderr) => {
              if (err) {
                return done()
              }

              const chunks = []
              stdout.on('data', (chunk) => {
                chunks.push(chunk)
              })

              stdout.on('end', () => {
                const buffer = Buffer.concat(chunks)

                const resizedImageParams = {
                  ACL: params.ACL,
                  ContentType: params.ContentType,
                  Key: `thumb-${params.Key}`,
                  Body: buffer
                }

                if (imageTest.test(file.mimetype)) {
                  const dimensions = sizeOf(buffer)
                  createMediaFileData.resizedDimensions = _.pick(dimensions, ['width', 'height'])
                }

                bucket.upload(resizedImageParams, (err, data) => {
                  if (err) {
                    done()
                  }

                  createMediaFileData.thumbnail = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${resizedImageParams.Key}`
                  done()
                })
              })

              stderr.on('data', (data) => {
                done()
              })
            })
        }

        gm(params.Body, createMediaFileData.name)
          .setFormat(extension)
          .quality('90')
          .gravity('Center')
          .crop('640', '640')
          .toBuffer((err, resizedImageBuffer) => {
            if (err) {
              return done()
            }

            const resizedImageParams = {
              ACL: params.ACL,
              ContentType: params.ContentType,
              Key: `thumb-${params.Key}`,
              Body: resizedImageBuffer
            }

            if (imageTest.test(file.mimetype)) {
              const dimensions = sizeOf(resizedImageBuffer)
              createMediaFileData.resizedDimensions = _.pick(dimensions, ['width', 'height'])
            }

            bucket.upload(resizedImageParams, function (err, data) {
              if (err) {
                done()
              }

              createMediaFileData.thumbnail = `${isDev ? config.cdn_host : process.env.CDN_HOST}/${resizedImageParams.Key}`
              done()
            })
          })
      }
    ], function onEndUpload(err, results) {
      if (err) {
        return res.status(400).send(err)
      }

      res.send(createMediaFileData)
    })
  })
  req.pipe(busboy)
})

module.exports = router
