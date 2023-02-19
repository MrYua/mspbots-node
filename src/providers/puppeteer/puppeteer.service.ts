import { Injectable, BadRequestException } from '@nestjs/common';
import { type PDFOptions } from 'puppeteer';
import { pool } from '@/helpers/puppeteer-pool';
import { merge, isFunction } from 'lodash';
import { PDF_CREATE } from '@/errors/errors.constants';

const DEFAULT_OPTIONS = {
  printBackground: true,
  preferCSSPageSize: true,
  timeout: 0,
  resolve: async () => {},
  reject: async () => {},
};

interface Options extends PDFOptions {
  resolve?(file: Buffer): Promise<void>;
  reject?(error: any): Promise<void>;
}

@Injectable()
export class PuppeteerService {
  async render(url: string, options: Options = {}) {
    const opts = merge(DEFAULT_OPTIONS, options);
    try {
      const file = await pool.use(async (instance) => {
        const page = await instance.newPage();

        await page.goto(url, {
          waitUntil: [
            'load',
            'domcontentloaded',
            'networkidle0',
            'networkidle2',
          ],
        });

        // await page.waitForSelector('[id^=dashboard-page-tag-]', { timeout: 0 });

        const file = await page.pdf(opts);

        await page.close();

        return file;
      });

      isFunction(opts.resolve) && opts.resolve(file);

      return file;
    } catch (error) {
      isFunction(opts.reject) &&
        opts.reject(new BadRequestException(PDF_CREATE));
    }
  }
}
