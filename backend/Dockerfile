
FROM python:3.12-slim

RUN apt-get update && apt-get install -y libgomp1

WORKDIR /app

COPY requirements.txt .

RUN python3 -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "src.main:app", "--host=0.0.0.0", "--port=80"]
