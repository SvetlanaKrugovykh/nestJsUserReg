import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThirdPartyService } from './third-party-services.service';
import { Buffer } from 'buffer';

@ApiTags('third-party-services')
@Controller('third-party-services')
export class ThirdPartyServicesController {
  constructor(private thirdPartyService: ThirdPartyService) {}

  @ApiOperation({ summary: 'Get avatar from the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/get')
  async getAvatar(@Body() key): Promise<any> {
    return await this.thirdPartyService.getAvatar(key);
  }

  @ApiOperation({ summary: 'Upload to the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/upload')
  async uploadAvatar(@Headers() headers: any, @Body() body: any) {
    let key = '';
    const buffer = Buffer.from(JSON.stringify(body));
    if (headers['content-type'] === 'image/jpeg') {
      key = headers.key;
    } else {
      throw new Error('Invalid file type');
    }
    return await this.thirdPartyService.uploadAvatar(buffer, key);
  }

  @ApiOperation({ summary: 'Remove from the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/remove')
  async removeAvatar(@Body() body: any): Promise<any> {
    return await this.thirdPartyService.removeAvatar(body.key);
  }
  @ApiOperation({ summary: 'Update to the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/update')
  async updateAvatar(@Headers() headers: any, @Body() body: any) {
    let key = '';
    const buffer = Buffer.from(JSON.stringify(body));
    if (headers['content-type'] === 'image/jpeg') {
      key = headers.key;
    } else {
      throw new Error('Invalid file type');
    }
    return await this.thirdPartyService.updateAvatar(buffer, key);
  }
}
