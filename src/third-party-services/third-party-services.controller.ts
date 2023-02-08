import { Body, Controller, Post } from '@nestjs/common';
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
  async getAvatar(@Body() body: any): Promise<any> {
    const key = 'DSC_0070-1.jpg';
    return await this.thirdPartyService.getAvatar(key);
  }

  @ApiOperation({ summary: 'Upload to the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/upload')
  async uploadAvatar(@Body() body: any): Promise<any> {
    const buffer = Buffer.from(JSON.stringify(body));
    const key = 'DSC_0070-2.jpg';
    return await this.thirdPartyService.uploadAvatar(buffer, key);
  }

  @ApiOperation({ summary: 'Remove from the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/remove')
  async removeAvatar(@Body() key: string): Promise<any> {
    return await this.thirdPartyService.removeAvatar(key);
  }
  @ApiOperation({ summary: 'Update to the bucket' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/update')
  async updateAvatar(@Body() body: any): Promise<any> {
    const buffer = Buffer.from(JSON.stringify(body));
    const key = 'DSC_0070-1.jpg';
    return await this.thirdPartyService.updateAvatar(buffer, key);
  }
}
