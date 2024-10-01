
import React, { Component } from "react";
import { Box, Typography, Button, ListItem, ListItemAvatar, ListItemText, IconButton, Avatar } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from '@mui/icons-material/Download';
import axiosInstance from './service';
import { withRouter } from 'react-router-dom';
import { DOWNLOAD_API, GET_ALL_FILES, UPLOAD_API } from "./constants";

export default class UploadFiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
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
    downloadFile(file) {
        console.log(file);
        try {
            axiosInstance.get(DOWNLOAD_API, {
                file: file,
                userId: this.user.id
            }).then(response => {
                if (response && response.data) {
                } else {
                    console.log("not found");
                }
            })
        } catch (err) {
            console.log("error downloading file");

        }
    }
    upload() {
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
            currentFile: currentFile,
            fileInfos: listFiles,
            selectedFiles: undefined
        });
        
        const formData = new FormData();
        formData.append('file', currentFile);
        
        axiosInstance.post(UPLOAD_API, formData).then((response) => {
            if (response && response.data) {
                this.setState({
                    fileInfos: response.data
                });
            }
        }, (error) => {
            this.props.history.push('/login'); 
        });

        this.setState({
            selectedFiles: undefined,
        });
    }


    componentDidMount() {
        try {
            const userData = localStorage.getItem('userData');

            // If token exists, add it to headers
            if (userData) {
                const userInfo = JSON.parse(userData);
                axiosInstance.get(GET_ALL_FILES, { userId: this.user.id }).then(response => {
                    if (response && response.data) {
                        this.setState({
                            fileInfos: response.data,
                        });
                    }
                }, (error) => {

                });
            }
        } catch {
            console.log("error in get all files");
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