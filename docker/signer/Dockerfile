FROM python:3.11

WORKDIR signer

COPY signer/requirements.txt .

RUN pip install -r requirements.txt

CMD ["python", "main.py"]