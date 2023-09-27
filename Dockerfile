# Use a Node.js base image
FROM node:16-alpine 

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (or package-lock.json) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
# Copy the rest of the application code to the working directory
COPY . .
RUN npm run build
RUN npx prisma generate
# Expose the port your Nest.js application is running on
EXPOSE 3000
ENV DATABASE_URL="postgres://mdmedoo7:U0owvS7jhJeO@ep-tiny-bread-81562764-pooler.eu-central-1.aws.neon.tech/neondb?pgbouncer=true&connect_timeout=10"
ENV DIRECT_URL="postgres://mdmedoo7:U0owvS7jhJeO@ep-tiny-bread-81562764.eu-central-1.aws.neon.tech/neondb?connect_timeout=10"
ENV ACCESS_SECRET="Mwalana"
ENV EMAIL_PASSWORD="koignudkxsouyscj"
ENV EMAIL_USER="mdmedoo7@gmail.com"
ENV EMAIL_HOST="smtp.gmail.com"
ENV PORT=3000
# Start the Nest.js application
CMD [ "node", "dist/main" ]
