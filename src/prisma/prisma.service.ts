import { PrismaClient } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configService: ConfigService){
        super({
            datasources: {
                db: {
                    url: configService.get("DATABASE_URL"),
                },
            }
        })
    }   

    cleanDb() {
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany(),
        ]);        
    }
}
