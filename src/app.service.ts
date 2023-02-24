import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

const size = {
  a4: {
    width: 535,
    height: 750,
  },
  A4: {
    width: 535,
    height: 750,
  },
  letter: {
    width: 535,
    height: 708,
  }
}

const landscapeSize = {
  a4: {
    width: 750,
    height: 530,
  },
  A4: {
    width: 750,
    height: 530,
  },
  letter: {
    width: 708,
    height: 545,
  }
}

@Injectable()
export class AppService {
  async renderPdf(url: string, format: string = 'a4', orientation: string = "portrait", scale?: number,) {



    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--no-zygote',
        // "--single-process",
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--disable-extensions',
        '--disable-file-system',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--safebrowsing-disable-auto-update',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--font-render-hinting=medium',
      ],
      ignoreHTTPSErrors: true,
      timeout: 180000,
    });

    Logger.log('launch browser');
    const page = await browser.newPage();

    try {
      Logger.log('prepare new page' + url);

      page.on('error', async (err) => {
        Logger.error(`Error event emitted: ${err}`);
        Logger.error(err.stack);
        Logger.error(`error2 =================================${url}`);
        await browser.close();

        throw err;
      });

      page.on('request', async (request) => {
        if (request.url().indexOf('/sys/model/sql') !== -1) {
          // Logger.log(`
          //       ${request.url()}
          //       ======================
          //       ${request.postData()}
          //     `);
        }
      });

      page.on('requestfailed', async (request) => {
        Logger.error(`
            ${request.url()} 
            ======================
            ${request.postData()}
            ======================
            ${request.response()}
          `);
        await browser.close();
      });

      await page.setDefaultNavigationTimeout(0);

      await page.emulateMediaType('screen');



      Logger.log(`go to ${url}`);



      await page.goto(url, { waitUntil: 'networkidle0' });


      const { width,
        height } = await page.evaluate(() => {
          const dom = document.querySelector('.report-layout-views > div > .view-item')
          const width = dom.clientWidth
          const height = dom.clientHeight

          return {
            width,
            height
          }
        })

      await page.setViewport({
        width,
        height,
        deviceScaleFactor: 1
      })

      const { pageRanges } = await page.evaluate(() => {
        const dom: any = document.querySelector('.report-layout-views > div > .vue-grid-layout')

        let pages = 0;

        (document.querySelector('.report-layout-views') as any).style['padding'] = 0;
        (document.querySelector('.report-layout-views') as any).style['margin'] = 0;

        dom.style['display'] = 'none';

        document.querySelectorAll('.report-layout-views > div > .view-item').forEach((item: any, index: number) => {


          pages += 1;

          item.setAttribute(
            'style',
            `page-break-before:always;box-shadow: none;border: 0;`,
          );
        });

        const pageRanges = `1-${pages}`;


        return {
          pageRanges,
        };
      });


      Logger.log(`wait seletc [id^=dashboard-page-tag-] ===============================${url}`);
      await page.waitForSelector('[id^=dashboard-page-tag-]');

      Logger.log(`prepare pdf`, orientation === 'portrait' ? size[format] : landscapeSize[format]);
      // Logger.log(scale || 1);
      const data = await page.pdf({
        printBackground: true,
        ...orientation === 'portrait' ? size[format] : landscapeSize[format],
        scale: 1,
        pageRanges,
        preferCSSPageSize: true,
        path: './temp/a.pdf',
      });

      Logger.log(`complete pdf ===============================${url}`);

      await page.close();
      Logger.log(`page close ===============================${url}`);
      await browser.close();
      Logger.log(`browser close ===============================${url}`);
      return data;
    } catch (error) {
      await browser.close();
      Logger.error(`error1 =================================${url}`);
      throw error;
    }
  }
}
