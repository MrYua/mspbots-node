import { Injectable, BadRequestException } from '@nestjs/common';
import { type PDFOptions } from 'puppeteer';
import { pool } from '@/helpers/puppeteer-pool';
import { merge, isFunction } from 'lodash';
import { PDF_CREATE } from '@/errors/errors.constants';

const DEFAULT_OPTIONS = {
  printBackground: true,
  preferCSSPageSize: true,
  timeout: 0,
  format: 'A4',
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

        await page.setDefaultNavigationTimeout(0);

        
        await page.goto(url, {
          waitUntil: [
            'load',
            'domcontentloaded',
            'networkidle0',
            'networkidle2',
          ],
        });

        const { width, height, pageRanges } = await page.evaluate(() => {
          const pageHeaderDom = document.querySelector(
            '.report-layout-views > div > .vue-grid-layout',
          ) as HTMLElement;

          pageHeaderDom.style['display'] = 'none';

          const viewsDom = document.querySelector(
            '.report-layout-views',
          ) as HTMLElement;

          viewsDom.style['padding'] = '0';
          viewsDom.style['margin'] = '0';

          const pageDom = document.querySelector(
            '.report-layout-views > div > .view-item',
          ) as HTMLElement;


          const allItems = document.querySelectorAll(
            '.report-layout-views > div > .view-item',
          );

          let pages = 0;
          allItems.forEach((item: HTMLElement) => {
            pages += 1;

            item.style['page-break-before'] = 'always'
            item.style['box-shadow'] = 'none'
          });

          return {
            width: parseFloat(pageDom.style.width) * 3.78,
            height: parseFloat(pageDom.style.height) * 3.78,
            pageRanges: `1-${pages}`,
          };
        });

        opts.pageRanges = pageRanges;

        await page.setViewport({
          width: parseInt(width.toString()),
          height: parseInt(height.toString()),
        });

        await page.waitForSelector('[id^=dashboard-page-tag-]', {
          timeout: 10000,
        });

        const file = await page.pdf(opts);

        await page.close();

        return file;
      });
      isFunction(opts.resolve) && opts.resolve(file);

      return file;
    } catch (error) {
      console.log(error, 'error');
      isFunction(opts.reject) &&
        opts.reject(new BadRequestException(PDF_CREATE));
    }
  }
}
