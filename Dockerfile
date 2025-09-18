# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json first for caching
COPY package*.json ./

# Install glibc & OpenSSL required for Prisma
RUN apk add --no-cache bash libc6-compat openssl

# Install dependencies
RUN npm install

# Copy prisma schema before generating client
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Expose NestJS default port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
