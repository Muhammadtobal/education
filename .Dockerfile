# استخدام صورة Node.js الإصدار 22 مع نظام Alpine
FROM node:22-alpine

# تثبيت حزمة FFmpeg و Redis معاً على نظام Alpine
RUN apk add --no-cache ffmpeg redis

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات اعتماد الحزم
COPY package*.json ./

# تثبيت الحزم
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# إنشاء سكريبت تشغيل لبدء خادم Redis ثم تشغيل تطبيق Node.js
# أو يمكنك تشغيل Redis في الخلفية قبل بدء التطبيق
CMD redis-server --daemonize yes && npm run start