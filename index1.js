(async function() {
    const { access_key, secret } = require('./index.js')
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({ accessKeyId: access_key, secretAccessKey: secret, signatureVersion: 'v4' });

    const obj = await s3.getObject({ Bucket: 's3-event-triggers', Key: 'files/fb373472-c51c-4c17-b075-918b15e665e1.pdf'}).promise();
    console.log('Object: ', obj);
})();

