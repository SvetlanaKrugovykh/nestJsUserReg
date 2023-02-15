import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import puppeteer from 'puppeteer';

@Injectable()
export class ConvertService {
  async generatePdfFromHtml(htmlPath: string, type: string): Promise<any> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (type == 'url') {
      await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    } else {
      const html = await readFile(htmlPath, 'utf8');
      await page.setContent(html);
    }

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return pdfBuffer;
  }
}
