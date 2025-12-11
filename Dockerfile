##############################################
# Stage 1: Builder
##############################################
FROM node:18-slim AS builder

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (only needed once)
RUN npm install --production

# Copy rest of the application source code
COPY . .


##############################################
# Stage 2: Runtime
##############################################
FROM node:18-slim AS runtime

# Install system dependencies
RUN apt-get update && apt-get install -y \
    cron \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Set timezone to UTC
RUN ln -sf /usr/share/zoneinfo/UTC /etc/localtime && \
    echo "UTC" > /etc/timezone

# Create working directory
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app /app

# Create necessary directories
RUN mkdir -p /data && \
    mkdir -p /cron && \
    chmod -R 755 /data /cron

# Copy cron job file
COPY cron/2fa-cron /etc/cron.d/2fa-cron

# Set correct permissions for cron file
RUN chmod 0644 /etc/cron.d/2fa-cron

# Apply cron job
RUN crontab /etc/cron.d/2fa-cron

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose API port
EXPOSE 8080

# Start cron and Node server
CMD ["/bin/sh", "/start.sh"]