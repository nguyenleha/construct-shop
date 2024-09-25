# Sử dụng Node.js 18 là base image
FROM node:20.15.1 AS build

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép toàn bộ mã nguồn từ thư mục backend vào container
COPY ./backend .

# Production Stage
FROM node:20.15.1 AS production

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép node_modules và build từ stage build
COPY --from=build /usr/src/app .

RUN npm install

# Cấu hình biến môi trường nếu cần
ENV NODE_ENV=production

RUN npm run build

# Expose port 2209
EXPOSE 2209

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
