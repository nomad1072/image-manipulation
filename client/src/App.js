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
    files: []
  }
  onDrop = async (acceptedFiles, rejectedFiles) => {
    this.setState({files: this.state.files.concat(acceptedFiles)});
    if(acceptedFiles.length) {
      let formData = new FormData();
      // formData.append("image", acceptedFiles[0]);
      formData.set("test_image", acceptedFiles[0]);
      console.log(formData.get("test_image"))
      const res = await axios.post('/api/v1/transform_image', formData, {
        responseType: "blob"
      });
      const blob = new Blob([res.data], {
        type: acceptedFiles[0].type
      });
      const reportUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = reportUrl;
      link.setAttribute("download", acceptedFiles[0].name);
      document.body.appendChild(link);
      link.click();
    } else {
      alert('Please upload a valid file');
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
            <Dropzone accept="image/*" onDrop={this.onDrop}>
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
              
          </div>
          <div className="failed-content">If drag and drop is not supported, click the area to open the file upload dialog.</div>
        </header>
      </div>
    );
  }
}

export default App;
