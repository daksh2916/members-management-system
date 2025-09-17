// src/members/members.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { S3Service } from '../s3/s3.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private s3Service: S3Service,
  ) {}

  async startDraft() {
    const draftId = uuid();
    await this.redis.set(`member:draft:${draftId}`, JSON.stringify({}), 86400); // 24h TTL
    return { draftId };
  }

  async savePersonalWithFiles(
    draftId: string, 
    dto: any, 
    files: { profilePic?: Express.Multer.File[], panPhoto?: Express.Multer.File[], aadharPhoto?: Express.Multer.File[] }
  ) {
    const key = `member:draft:${draftId}`;
    const existing = await this.redis.get(key);
    const draft = existing ? JSON.parse(existing) : {};
    

    draft.personal = dto;
    
   
    if (!draft.files) draft.files = {};
    
    if (files.profilePic && files.profilePic[0]) {
      const fileUrl = await this.s3Service.uploadFile(files.profilePic[0], draftId, 'profile');
      draft.files.profile = fileUrl;
    }
    
    if (files.panPhoto && files.panPhoto[0]) {
      const fileUrl = await this.s3Service.uploadFile(files.panPhoto[0], draftId, 'pan');
      draft.files.pan = fileUrl;
    }
    
    if (files.aadharPhoto && files.aadharPhoto[0]) {
      const fileUrl = await this.s3Service.uploadFile(files.aadharPhoto[0], draftId, 'aadhar');
      draft.files.aadhar = fileUrl;
    }
    
    await this.redis.set(key, JSON.stringify(draft), 86400);
    return { 
      draftId, 
      stepSaved: 'personal',
      filesUploaded: {
        profile: !!draft.files.profile,
        pan: !!draft.files.pan,
        aadhar: !!draft.files.aadhar
      }
    };
  }

  async saveStep(draftId: string, step: string, dto: any) {
    const key = `member:draft:${draftId}`;
    const existing = await this.redis.get(key);
    const draft = existing ? JSON.parse(existing) : {};
    draft[step] = dto;
    await this.redis.set(key, JSON.stringify(draft), 86400);
    return { draftId, stepSaved: step };
  }

  async finalizeDraft(draftId: string) {
    const key = `member:draft:${draftId}`;
    const data = await this.redis.get(key);
    if (!data) throw new Error('Draft not found or expired');
    const draft = JSON.parse(data);

    // Create member with file URLs
    const memberData = {
      ...draft.personal,
      profilePicUrl: draft.files?.profile,
      panPhotoUrl: draft.files?.pan, 
      aadharPhotoUrl: draft.files?.aadhar,
    };

    const member = await this.prisma.member.create({
      data: {
        ...memberData,
        membership: {
          create: draft.membership,
        },
        businessInfo: {
          create: draft.business,
        },
        bankingInfo: {
          create: draft.banking,
        },
      },
      include: { membership: true, businessInfo: true, bankingInfo: true },
    });

    await this.redis.del(key);
    return member;
  }

  async getMembers(query: any) {
    const { page = 1, pageSize = 10, type } = query;
    return this.prisma.member.findMany({
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize),
      where: type ? { membership: { type } } : {},
      include: { membership: true, businessInfo: true },
    });
  }

  async getMemberById(id: string) {
    return this.prisma.member.findUnique({
      where: { id },
      include: { membership: true, businessInfo: true, bankingInfo: true, events: true },
    });
  }

  async updateMember(id: string, dto: any) {
    return this.prisma.member.update({
      where: { id },
      data: dto,
    });
  }

  async deleteMember(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}