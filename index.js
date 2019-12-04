const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); 
const formidable = require('formidable');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid/v4');
const { access_key, secret } = require('./index.js')
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ accessKeyId: access_key, secretAccessKey: secret, signatureVersion: 'v4' });

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const assets = path.join(__dirname, "output_pics");
app.use(express.static(assets));

app.post('/api/v1/upload', async (req, res) => {
    console.log('In controller')
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {  
        try {
            const unique_id = uuid();
            console.log('UUID: ', unique_id);
            const file = Object.keys(files);
            const file_path = files[file[0]].path;
            const file_name = files[file[0]].name;
            const file_bytes = fs.readFileSync(file_path, );
            console.log('FIle Path: ', file_path);
            console.log('FIles: <<<<<', files[file[0]]);
            // const rs = fs.createReadStream(path.join(`${file_path}.pdf`));
            // console.log('RS: ', rs);
            const params = { Bucket: 's3-event-triggers', Key: `files/${unique_id}.pdf` }
            
            await s3.upload({ ...params, Body: file_bytes }).promise();
            console.log('Uploaded');
            // TODO: Send to rabbitmq
            const ip = "10.202.121.62"
            const rabbit_url = `http://${ip}:5000/api/v1/rabbitmq/${unique_id}/${file_name}`;
            
            // const bytes = await fs.readFile(file_path, 'binary');
            // console.log('Bytes: ', bytes.toString());
            console.log('Bytes: ', bytes);
            const response = await axios.post(rabbit_url, bytes.toString('binary'))
            console.log('Response: ', response.status);
            return res.status(200).json({
                uuid: unique_id
            })
        } catch (e) {
            console.error(e);
            return res.status(404).send({error: e});
        }
    });
});

app.post('/api/v1/ping/:id', async (req, res) => {
    console.log('Ping');
    try {
        const id = req.params.id;
        // Ping Redis
        console.log('Id: ', id);
        const ip = "10.202.121.62"
        const redis_url = `http://${ip}:5000/api/v1/redis/${id}`;
        const response = await axios.get(redis_url);
        console.log('Response: ', response.status);
        return res.status(200).json({ status: 'incomplete' })
    } catch(err) {
        console.log('Error: ', err);
    }
});

// app.use('/api/v1', router);

const clientBuildPath = path.join(__dirname, "client", "build");
app.use(express.static(clientBuildPath));
app.use("*", (req, res) => {
    console.log('Here!');
    res.sendFile(`/client/build/index.html`, { root: __dirname });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});