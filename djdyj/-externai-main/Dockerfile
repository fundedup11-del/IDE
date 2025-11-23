FROM node:18-alpine

# Create app directory
WORKDIR /app

# Prevent interactive prompts
ENV CI=true

# Copy package manifests first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --silent || npm install --silent

# Copy the rest of the source
COPY . .

# Expose default Next.js port
EXPOSE 3000

# Default command to run dev server and bind to all interfaces
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["npm", "run", "dev"]
