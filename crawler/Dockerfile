FROM python:3.12-slim

WORKDIR /app/crawler
COPY crawler/requirements.txt /app/crawler/requirements.txt
RUN pip install --no-cache-dir \
    -i https://pypi.tuna.tsinghua.edu.cn/simple \
    --trusted-host pypi.tuna.tsinghua.edu.cn \
    -r /app/crawler/requirements.txt

COPY crawler /app/crawler

CMD ["python", "main.py", "--source", "china_mix"]
