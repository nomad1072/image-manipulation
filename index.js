const express = require('express');
const bodyParser = require('body-parser');
const jimp = require('jimp');
const formidable = require('formidable');
const path = require('path');

const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());
const clientBuildPath = path.join("client", "build");
const assets = path.join(__dirname, "output_pics");
app.use(express.static(path.join(__dirname, clientBuildPath)));
app.use(express.static(assets));
app.use("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"), { root: __dirname });
});

app.post('/api/v1/transform_image', (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        try {
            const InputFiles = Object.keys(files);
            InputFiles.forEach(async (file) => {
                let val = await jimp.read(files[file].path);
                let mask = await jimp.read(path.join(__dirname, 'pics', 'white.jpg'));
                mask = await mask.resize(500, 500);
                val = await val.resize(250, 400);
                // updated_mask = await updated_mask.invert();
                // updated_mask.write(path.join(__dirname, 'updated_mask.jpg'))
                // val.mask(mask, 0, 0);
                // val.write(path.join(__dirname, 'test_image.jpg'));
                mask.composite(val, 120, 50);
                mask.write(path.join(__dirname, 'output_pics','test_image.jpg'));
            });
            
            return res.status(200).send({success: true})
        } catch (e) {
            console.error(e);
            return res.status(404).send({error: e});
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});