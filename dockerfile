# Use the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest

# Create and set the working directory first (as root)
USER root
RUN mkdir -p /app && chown pptruser:pptruser /app
WORKDIR /app

# Switch to pptruser before copying files
USER pptruser

# Copy package files
COPY --chown=pptruser:pptruser package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY --chown=pptruser:pptruser . .

# Start the application
CMD ["npm", "start"]