FROM python:3.11

WORKDIR telegram

COPY telegram/requirements.txt .

RUN pip install -r requirements.txt

CMD ["python", "run.py"]