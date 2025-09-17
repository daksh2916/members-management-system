// src/members/members.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @Post('start')
    async startDraft() {
        return this.membersService.startDraft();
    }

    @Post(':draftId/personal')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'profilePic', maxCount: 1 },
        { name: 'panPhoto', maxCount: 1 },
        { name: 'aadharPhoto', maxCount: 1 }
    ]))
    async savePersonal(
        @Param('draftId') draftId: string, 
        @Body() dto: any,
        @UploadedFiles() files: { profilePic?: Express.Multer.File[], panPhoto?: Express.Multer.File[], aadharPhoto?: Express.Multer.File[] }
    ) {
        return this.membersService.savePersonalWithFiles(draftId, dto, files);
    }

    @Post(':draftId/membership')
    async saveMembership(@Param('draftId') draftId: string, @Body() dto: any) {
        return this.membersService.saveStep(draftId, 'membership', dto);
    }

    @Post(':draftId/business')
    async saveBusiness(@Param('draftId') draftId: string, @Body() dto: any) {
        return this.membersService.saveStep(draftId, 'business', dto);
    }

    @Post(':draftId/banking')
    async saveBanking(@Param('draftId') draftId: string, @Body() dto: any) {
        return this.membersService.saveStep(draftId, 'banking', dto);
    }

    @Post(':draftId/complete')
    async complete(@Param('draftId') draftId: string) {
        return this.membersService.finalizeDraft(draftId);
    }

    @Get()
    async getMembers(@Query() query: any) {
        return this.membersService.getMembers(query);
    }

    @Get(':id')
    async getMember(@Param('id') id: string) {
        return this.membersService.getMemberById(id);
    }

    @Patch(':id')
    async updateMember(@Param('id') id: string, @Body() dto: any) {
        return this.membersService.updateMember(id, dto);
    }

    @Delete(':id')
    async deleteMember(@Param('id') id: string) {
        return this.membersService.deleteMember(id);
    }
}