import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){

    }
    async getBookmarks(userId: number) {
        return await this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        })
    }

    getBookmarkById(userId: number, bookmarkId: number) {}

    editBookmarkById(userId: number, bookmarkId:number, dto: CreateBookmarkDto) {}

    deleteBookmarkById(userId: number, bookmarkId: number) {}

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto,
            }
        })

        return bookmark;
    }

}
