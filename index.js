const express = require('express');
const bodyParser = require('body-parser');
const jimp = require('jimp');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 4000;
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const assets = path.join(__dirname, "output_pics");
app.use(express.static(assets));


app.post('/api/v1/transform_image', (req, res) => {
    console.log('In controller')
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {  
        try {
            let output_path = "";
            const file = Object.keys(files);
            let val = await jimp.read(files[file[0]].path);
            let mask = await jimp.read(path.join(__dirname, 'pics', 'white.jpg'));
            mask = await mask.resize(500, 500);
            val = await val.resize(250, 400);
            mask.composite(val, 120, 50);
            output_path = path.join(__dirname, 'output_pics', files[file[0]].name);
            name = files[file[0]].name;
            await mask.write(output_path);
            const rs = fs.createReadStream('output_path');
            rs.pipe(res);
            rs.on("error", () => {
                return res.status(404).send({error: "File not generated"});
            })
            // res.sendFile(output_path);
        } catch (e) {
            console.error(e);
            return res.status(404).send({error: e});
        }
    });
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