FROM python:3.10-slim

WORKDIR /app

# Install system dependencies (kept minimal)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 1. Install PyTorch CPU-only specifically (Huge size saving)
# We do this BEFORE other requirements to cache this heavy layer
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# 2. Copy and install other requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Unbuffered output for better logs
ENV PYTHONUNBUFFERED=1

CMD ["python", "server.py"]