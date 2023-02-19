import { Injectable } from '@nestjs/common';
import { type PDFOptions } from 'puppeteer';
import { pool } from '@/helpers/puppeteer-pool';
import { merge } from 'lodash';

const DEFAULT_OPTIONS = {
  printBackground: true,
  preferCSSPageSize: true,
};

@Injectable()
export class PuppeteerService {
  async render(url: string, options: PDFOptions = {}) {
    const opts = merge(DEFAULT_OPTIONS, options);

    const file = await pool.use(async (instance) => {
      const page = await instance.newPage();

      await page.goto(url, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'],
      });

      // await page.waitForSelector('[id^=dashboard-page-tag-]');

      const file = await page.pdf(opts);

      await page.close();

      return file;
    });

    return file;
  }
}
