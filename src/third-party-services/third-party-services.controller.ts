import { Controller, Post, Body, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThirdPartyService } from './third-party-services.service';
import { Buffer } from 'buffer';
import { writeFile } from 'fs/promises';
import { uuid } from 'uuidv4';

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

  @ApiOperation({ summary: 'Converter for example html to pdf' })
  @ApiResponse({ status: 200, type: '' })
  @Post('/converter')
  async formatConverter(@Body() body: any, @Res() res: Response): Promise<any> {
    const pdfBuffer = await this.thirdPartyService.formatConverter(body);
    const tempPdfFilePath = 'temp/' + uuid() + '.pdf';
    await writeFile(tempPdfFilePath, pdfBuffer);
    res.sendFile(tempPdfFilePath, { root: '.' });
  }
}
