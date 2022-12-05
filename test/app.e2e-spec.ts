import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { addWaitHandler } from 'pactum/src/exports/handler';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {    
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleRef.createNestApplication();
    (await app).useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    app.close();
  })
  
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'luthfi@gmail.com',
      password: '12345',
    }
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signup').withBody({password: dto.password}).expectStatus(400);
      })
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signup').withBody({email: dto.email}).expectStatus(400);
      })
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      })
      it('should signup', ()=> {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum.spec().post('/auth/signin').withBody({password: dto.password}).expectStatus(400);
      })
      it('should throw if password empty', () => {
        return pactum.spec().post('/auth/signin').withBody({email: dto.email}).expectStatus(400);
      })
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      })
      it('should signin', ()=> {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('user_token','token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', ()=> {
        return pactum.spec().get('/users/me').withHeaders({
          Authorization: 'Bearer $S{user_token}'
        }).expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit current user', ()=> {
        const dto: EditUserDto = {
          firstName: "Luth",
          email: 'luthfi@gmail.com',
        }
        return pactum.spec().patch('/users').withHeaders({
          Authorization: 'Bearer $S{user_token}'
        }).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email);
      });
    });

  });

  describe('Bookmarks', () => {
    const dto: CreateBookmarkDto = {
      title: "Title",
      description: "Description",
      link: "https://google.com",
    }
    describe('Get empty bookmarks', () => {
      it('should return empty bookmark', ()=> {
        return pactum.spec().get("/bookmarks/").withHeaders({
          Authorization: 'Bearer $S{user_token}'
        }).expectStatus(200).expectBody([])
      });
    });

    describe('Create bookmark', () => {
      it('should create bookmark', ()=> {
        return pactum.spec().post("/bookmarks/").withHeaders({
          Authorization: 'Bearer $S{user_token}'
        }).withBody(dto).expectStatus(201).expectBodyContains(dto.title).stores('bookmarkId', 'id')
      });
    });

    describe('Get bookmark by id', () => {
      it('should pass', ()=> {});
    });

    describe('Edit bookmark by id', () => {
      it('should pass', ()=> {});
    });

    describe('Delete bookmark', () => {
      it('should pass', ()=> {});
    });

  });
})