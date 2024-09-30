
import React, { Component } from "react";
import { Box, Typography, Button, ListItem, ListItemAvatar, ListItemText, IconButton, Avatar, AppBar } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { DOWNLOAD_API, GET_ALL_FILES } from "./constants";

export default class UploadFiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            isError: false,
            fileInfos: [],
        };
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        if (localStorage.getItem('userData')) {
            this.user = JSON.parse(localStorage.getItem('userData'));
            console.log(this.user);
            
        }
    }
    async downloadFile(file) {
        console.log(file);
        try {
            const response = await axios.get(DOWNLOAD_API, {
              file: file,
              userId: this.user.id
            });
      
            if (response.data) {
              localStorage.setItem('userData', JSON.stringify(response.data));
             // navigateTo('/home');  
            } else {
              console.log("not found");
              
            }
          } catch (err) {
            console.log("error downloading file");

          }
    }
    setProgress() {
        //  let prevProgress = (this.state.progress >= 100 ? 10 : this.state.progress + 10)
        this.setState(
            {
                progress: 100
            });
    }
    async upload() {
        this.setProgress();
        console.log(this.state.selectedFiles);

        let currentFile = this.state.selectedFiles[0];
        let listFiles = [];
        if (this.state.fileInfos && this.state.fileInfos.length) {
            listFiles = [...this.state.fileInfos];
            listFiles.push(currentFile);
        } else {
            listFiles.push(currentFile);
        }

        this.setState({
            progress: 100,
            currentFile: currentFile,
            fileInfos: listFiles,
            selectedFiles: undefined
        });
        const response = await axios.post(this.upload, {
            file: currentFile,
            userId: this.user.id
        });
        if (response) {
            this.setState({
                fileInfos: response.files.data,
            });
        }
        // UploadService.upload(currentFile, (event) => {
        //   this.setState({
        //     progress: Math.round((100 * event.loaded) / event.total),
        //   });
        // })
        //   .then((response) => {
        //     this.setState({
        //       message: response.data.message,
        //       isError: false
        //     });
        //     return UploadService.getFiles();
        //   })
        //   .then((files) => {
        //     this.setState({
        //       fileInfos: files.data,
        //     });
        //   })
        //   .catch(() => {
        //     this.setState({
        //       progress: 0,
        //       message: "Could not upload the file!",
        //       currentFile: undefined,
        //       isError: true
        //     });
        //   });

        // this.setState({
        //   selectedFiles: undefined,
        // });
    }


    async componentDidMount() {

        const response = await axios.get(GET_ALL_FILES, {userId: this.user.id});
        if(response && response.data){
            this.setState({
                fileInfos: response.data,
              });
        }
    }

    selectFile(event) {
        this.setState({
            selectedFiles: event.target.files,
        });
    }
    render() {
        const {
            selectedFiles,
            currentFile,
            progress,
            message,
            fileInfos,
            isError
        } = this.state;

        return (
            <div className="upload-container">
                <p className="file-name-css">
                    {selectedFiles && selectedFiles.length > 0 ? selectedFiles[0].name : null}
                </p>
                <label htmlFor="btn-upload">
                    <input
                        id="btn-upload"
                        name="btn-upload"
                        style={{ display: 'none' }}
                        type="file"
                        onChange={this.selectFile} />
                    <Button
                        className="btn-choose"
                        variant="outlined"
                        component="span" >
                        Choose Files
                    </Button>
                </label>
                <span>&nbsp;&nbsp;</span>
                <Button
                    className="btn-upload"
                    color="primary"
                    variant="contained"
                    component="span"
                    disabled={!selectedFiles}
                    onClick={this.upload}>
                    Upload
                </Button>

                <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
                    {message}
                </Typography>

                {/* <Typography variant="h6" className="list-header">
                    List of Files
                </Typography> */}
                {/* {currentFile && (
                    <Box className="mb25" display="flex" alignItems="center">
                        <Box width="100%" mr={1}>
                            <LinearProgress variant="determinate" value={progress} />
                        </Box>
                        <Box minWidth={35}>
                            <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
                        </Box>
                    </Box>)
                } */}
                <ul className="list-group">
                    {fileInfos &&
                        fileInfos.map((file, index) => {
                            return (
                                <Box key={index}>
                                    <ListItem
                                        key={index}
                                        divider
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="download" onClick={() => { this.downloadFile(file) }}>
                                                <DownloadIcon key={index} />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <FolderIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${file.name}`}
                                        />
                                    </ListItem>
                                </Box>
                            )

                        })}
                </ul>
            </div >
        );
    }
}