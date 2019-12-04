import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import axios from 'axios';
import './App.css';


const baseStyle = {
  width: 400,
  height: 200,
  borderWidth: 2,
  borderColor: '#666',
  borderStyle: 'dashed',
  borderRadius: 5,
  
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#eee'
};
const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#c66',
  backgroundColor: '#eee'
};
class App extends Component {
  state = {
    files: [],
    file: '',
    filename: '',
    results: [],
    data: {}
  }
  onDrop = async (acceptedFiles, rejectedFiles) => {
    this.setState({files: this.state.files.concat(acceptedFiles)});
    if(acceptedFiles.length) {
      try {
        // let formData = new FormData();
        // formData.append("image", acceptedFiles[0]);
        console.log('Accepted files: ', acceptedFiles[0]);
        this.setState({ filename: acceptedFiles[0].name, file: acceptedFiles[0] })
        // formData.set("test_image", acceptedFiles[0]);
        // console.log(formData.get("test_image"))
        // const res = await axios.post('/api/v1/transform_image', formData, {
        //   responseType: "blob"
        // });
        // console.log('Response: ', res);
        // const blob = new Blob([res.data], {
        //   type: acceptedFiles[0].type
        // });
        // const reportUrl = window.URL.createObjectURL(blob);
        // const link = document.createElement("a");
        // link.href = reportUrl;
        // link.setAttribute("download", acceptedFiles[0].name);
        // document.body.appendChild(link);
        // link.click();
      } catch (e) {
        console.log(e);
      }
      
    } else {
      alert('Please upload a valid file');
    }
  }

  onClick = async () => {
    try {
      let formData = new FormData();
      console.log('Submit Button clicked!!!');
      console.log('File: ', this.state.file);
      formData.set("test_image", this.state.file);
      console.log(formData.get("test_image"))
      const res = await axios.post('/api/v1/upload', formData);
      console.log('Id: ', res.data.uuid);
      const id = res.data.uuid;
      setInterval(async function() {
        const res = await axios.post(`/api/v1/ping/${id}`);
        if(res.data.status === "complete") {
          const data = res.data.data;
          this.setState({ data: data });
          clearInterval();
        } 
      }, 5000);

    } catch(err) {
      console.log('Error: ', err);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="header-content">
              A simple utility app to mask your image onto a white background(500*500) 
          </div>
          <div className="drop-content">
            <Dropzone onDrop={this.onDrop} >
              {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
                let styles = {...baseStyle}
                styles = isDragActive ? {...styles, ...activeStyle} : styles
                styles = isDragReject ? {...styles, ...rejectStyle} : styles
                      
                return (
                  <div 
                    {...getRootProps()}
                    style={styles}
                  >
                    <input {...getInputProps()} />
                    <div>
                      {isDragAccept ? 'Drop' : 'Drag'} files here...
                    </div>
                    {isDragReject && <div>Unsupported file type...</div>}
                  </div>
                )
              }}
            </Dropzone>
          </div>
          <div className="file-list">
              <span> {this.state.filename} </span>
          </div>
          <div style={{ marginTop: "50px"}}>
            <button className="button-container" onClick={this.onClick} >
              Submit
            </button>
          </div>
          <div className="failed-content">If drag and drop is not supported, click the area to open the file upload dialog.</div>
        </header>
        { 
          this.state.results.length && (
          <div> 
            Yeah Results!
          </div>) 
        }
      </div>
    );
  }
}

export default App;
