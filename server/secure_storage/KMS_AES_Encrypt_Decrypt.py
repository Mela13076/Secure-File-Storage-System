import boto3
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os

aws_access_key_id='XXXXXXXXXXXXXX'
aws_secret_access_key='XXXXXXXXXXXXXXXXXXXXXXXXX'

# AWS clients for S3 and KMS
session = boto3.Session(
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name="us-east-1"
)
s3 = session.client('s3')
kms = session.client('kms')

# kms: arn:aws:kms:us-east-1:692859926065:key/3c21faa5-c72f-4452-8112-84a7339cb737
# s3: arn:aws:s3:::bucket-secure-file-storage

# AWS S3 and KMS configurations
bucket_name = 'bucket-secure-file-storage'
kms_key_id = '3c21faa5-c72f-4452-8112-84a7339cb737'  # Replace with your KMS key ID

# Encrypt a file before uploading it to S3 using a KMS-managed key
def kms_encrypt_file(file_path, kms_key_id, s3_bucket, s3_key):
    # Read the file content to encrypt
    with open(file_path, 'rb') as f:
        plaintext = f.read()

    # Generate a data encryption key (DEK) using AWS KMS
    response = kms.generate_data_key(KeyId=kms_key_id, KeySpec='AES_256')
    plaintext_key = response['Plaintext']  # The actual encryption key
    encrypted_data_key = response['CiphertextBlob']  # The encrypted key stored securely

    # Encrypt the file content using AES with the plaintext key
    iv = os.urandom(16)  # Generate a random initialization vector (IV)
    cipher = Cipher(algorithms.AES(plaintext_key), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext) + encryptor.finalize()

    # Upload the encrypted file (with IV and encrypted data key) to S3
    encrypted_content = iv + encrypted_data_key + ciphertext  # Concatenate IV, encrypted DEK, and encrypted file
    s3.put_object(Bucket=s3_bucket, Key=s3_key, Body=encrypted_content)

    print(f"File {file_path} encrypted and uploaded to S3 successfully.")

# Download and decrypt a file from S3 using the KMS-managed key
def kms_decrypt_file(s3_bucket, s3_key, output_file_path, kms_key_id):
    # Download the encrypted file from S3
    encrypted_object = s3.get_object(Bucket=s3_bucket, Key=s3_key)
    encrypted_data = encrypted_object['Body'].read()

    # Extract the IV, encrypted data key (DEK), and the actual ciphertext
    Deiv = encrypted_data[:16]  # The first 16 bytes are the IV
    decrypted_data_key = encrypted_data[16:16+184]  # The next 256 bytes are the encrypted data key
    ciphertextDecrypt = encrypted_data[16+184:]  # The rest is the encrypted file content
    
    # Decrypt the data key using AWS KMS
    response = kms.decrypt(CiphertextBlob=decrypted_data_key)
    plaintext_key = response['Plaintext']  # The plaintext data key

    # Decrypt the file content using AES with the decrypted data key
    cipher = Cipher(algorithms.AES(plaintext_key), modes.CFB(Deiv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_data = decryptor.update(ciphertextDecrypt) + decryptor.finalize()

    # Save the decrypted file locally
    with open(output_file_path, 'wb') as f:
        f.write(decrypted_data)

    print(f"File {output_file_path} downloaded and decrypted successfully.")

# Example usage:

# Encrypt and upload a file to S3
file_to_upload = 'uploadfile1.txt'
s3_key = 'test.txt'
kms_encrypt_file(file_to_upload, kms_key_id, bucket_name, s3_key)

# Download and decrypt the file from S3
downloaded_file = 'decrypt_test.txt'
kms_decrypt_file(bucket_name, s3_key, downloaded_file, kms_key_id)
