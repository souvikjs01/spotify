import redis from "redis"
import dotenv from "dotenv"
dotenv.config()

export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: "redis-10196.c264.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 10196
    }
})

