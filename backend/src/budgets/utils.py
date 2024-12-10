from urllib.parse import urlparse

import boto3
import os
from dotenv import load_dotenv
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import io

load_dotenv()

def get_s3_data(url: str):
    session = boto3.session.Session()
    client = session.client('s3',
                            endpoint_url='https://storage.yandexcloud.net',
                            region_name='ru-central1',
                            aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("S3_SECRET_KEY"))
    parsed_url = urlparse(url)
    path = parsed_url.path.lstrip('/')

    parts = path.split('/', 1)
    bucket_name = parts[0]
    object_key = parts[1] if len(parts) > 1 else ''

    response = client.get_object(Bucket=bucket_name, Key=object_key)
    file_content = response['Body'].read()

    df = pd.read_csv(io.BytesIO(file_content))

    labelencoder = LabelEncoder()
    df["client_id"] = labelencoder.fit_transform(df["client_id"])
    df["client_id"] = df["client_id"].astype('int')

    return df
