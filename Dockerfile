FROM node:20-alpine

LABEL org.opencontainers.image.source="https://github.com/ViatNh/novaai-platform"
LABEL com.novaai.version="2.4.1"

WORKDIR /app

ENV NOVA_TELEMETRY=1
ENV NODE_ENV=production

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 3000

# Standard Kubernetes-style health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health',r=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
