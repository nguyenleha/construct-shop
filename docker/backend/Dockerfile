# Sử dụng Node.js 18 là base image
FROM node:20.15.1 AS build

# Cài đặt các gói cần thiết
# RUN apk add --no-cache bash

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json từ thư mục backend
COPY ./backend/package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn từ thư mục backend vào container
COPY ./backend .

# Build ứng dụng NestJS
RUN npm run build

# Production Stage
FROM node:20.15.1 AS production

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép node_modules và build từ stage build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Cấu hình biến môi trường nếu cần
ENV NODE_ENV=production

# Expose port 2209
EXPOSE 2209

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
