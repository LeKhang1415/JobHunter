import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from 'ioredis'; // Import thư viện vừa cài

@Injectable()
// Cấy thêm 2 interface OnModuleInit (chạy lúc app bật) và OnModuleDestroy (chạy lúc app tắt)
export class RedisService implements OnModuleInit, OnModuleDestroy {
    // Biến này sẽ chứa đối tượng kết nối với Redis
    private redisClient: Redis;
    private readonly logger = new Logger(RedisService.name);

    // Hàm này tự động chạy khi NestJS khởi động xong
    onModuleInit() {
        // Tạo kết nối tới Redis Server đang chạy trên máy tính của bạn ở cổng 6379 (mặc định)
        this.redisClient = new Redis({
            host: 'localhost',
            port: 6379,
        });

        // Bắt sự kiện: Nếu kết nối thành công thì in ra log
        this.redisClient.on('connect', () => {
            this.logger.log('🚀 Đã kết nối thành công tới Redis Server!');
        });

        // Bắt sự kiện: Nếu lỗi thì in ra lỗi
        this.redisClient.on('error', (err) => {
            this.logger.error('❌ Lỗi kết nối Redis:', err);
        });
    }

    // Hàm này tự động chạy khi bạn tắt server NestJS
    onModuleDestroy() {
        if (this.redisClient) {
            this.redisClient.disconnect(); // Ngắt kết nối cho sạch sẽ
        }
    }

    // Hàm quan trọng nhất: Các file khác sẽ gọi hàm này để mượn cái ống nước (redisClient) 
    // đi hút/bơm dữ liệu vào Redis
    getClient(): Redis {
        return this.redisClient;
    }
}
