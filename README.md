
# Secure File Storage System

## Description

This project involves creating a **secure file storage system** that allows users to upload and download files while ensuring that sensitive information remains protected. The core feature of this system is data security, achieved through **encryption** (both symmetric and asymmetric) and proper management of encryption keys. Only authorized users will have access to specific files, and each file will be encrypted before storage. 

The project is designed to be deployed on a cloud platform (e.g., AWS), leveraging cloud security tools like **AWS KMS** (Key Management Service) for key management and **IAM** (Identity and Access Management) for access control. 

The project is divided into several key stages:
- File encryption
- Secure storage
- Key management
- User authentication
- Cloud deployment

## How to Run the Project

### Frontend (Client)
To run the **frontend** part of the project, follow these steps:

1. Open your terminal and **navigate to the `client` folder**:
   ```bash
   cd client
   ```

2. Run the following command to start the development server:
   ```bash
   npm run dev
   ```

This will start the frontend, and you can access it by opening your browser and navigating to the URL provided in the terminal (usually `http://localhost:3000`).

### Backend (Server)
To run the **backend** (Django server) part of the project, follow these steps:

1. Open your terminal and **navigate to the `server` folder**:
   ```bash
   cd server
   ```

2. Then, navigate to the `secure_storage` folder:
   ```bash
   cd secure_storage
   ```

3. Run the following command to start the Django server:
   ```bash
   python manage.py runserver
   ```

This will start the Django development server, and you can access the backend at `http://127.0.0.1:8000/`.

### Database Setup

To apply all the **database migrations** (to set up the database schema), follow these steps:

#### 1. Running Migrations for the `files` App
Ensure that you are inside the `secure_storage` folder and run the following commands to apply the models in the `files` folder:

```bash
python manage.py makemigrations files
python manage.py migrate
```

#### 2. Running Migrations for Regular Django Files
To apply the regular migrations for Django’s built-in apps and any other apps, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

This will ensure that all the necessary database changes are applied.

---

## Tech Stack

- **Frontend**: React (or the chosen frontend framework)
- **Backend**: Django with Django Rest Framework (DRF) for API
- **Cloud**: AWS (Amazon Web Services)
  - **AWS S3** for file storage
  - **AWS KMS** for key management
  - **AWS IAM** for access control

## Security Features

- **AES Encryption** for file content
- **RSA Encryption** for key management
- **JWT Authentication** for user authorization and secure access
- **AWS KMS** for secure key storage

## Deployment

The project is designed to be deployed on a cloud platform (AWS), leveraging best cloud security practices such as:
- **Server-side encryption** for files stored in S3
- **Key management** with AWS KMS
- **Role-based access control** using AWS IAM policies

