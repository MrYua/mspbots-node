import { createPool, type Options as PoolOptions } from 'generic-pool';
import puppeteer, { PuppeteerLaunchOptions, Browser } from 'puppeteer';
import { merge } from 'lodash';

interface Instance extends Browser {
  useCount: number;
}

const DEFAULT_POOL = {
  max: 4,
  min: 1,
  testOnBorrow: true,
  autostart: false,
  idleTimeoutMillis: 1000 * 60 * 60,
  evictionRunIntervalMillis: 1000 * 60 * 3,
  maxUses: 2048,
  validator: (instance: Instance) => Promise.resolve(true),
};

const DEFAULT_PUPPETEER = {
  ignoreHTTPSErrors: true,
  headless: false,
  timeout: 0,
  pipe: true,
  slowMo: 0,
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
};

export const createPuppeteerPool = (
  options: PuppeteerLaunchOptions = {},
  poolOptions: PoolOptions = {},
) => {
  const opts = merge(DEFAULT_POOL, poolOptions);

  const factory = {
    create: async () => {
      const instance = (await puppeteer.launch(
        merge(DEFAULT_PUPPETEER, options),
      )) as Instance;
      instance.useCount = 0;
      return instance;
    },
    destroy: async (instance: Instance) => {
      instance.close();
    },
    validate: async (instance: Instance) => {
      return opts
        .validator(instance)
        .then((valid) =>
          Promise.resolve(
            valid && (opts.maxUses <= 0 || instance.useCount < opts.maxUses),
          ),
        );
    },
  };

  const pool = createPool<Instance>(factory, opts);
  const genericAcquire = pool.acquire.bind(pool);

  pool.acquire = () =>
    genericAcquire().then((instance) => {
      instance.useCount += 1;
      return instance;
    });

  pool.use = (fn) => {
    let resource;
    return pool
      .acquire()
      .then((r) => {
        resource = r;
        return resource;
      })
      .then(fn)
      .then(
        (result) => {
          pool.release(resource);
          return result;
        },
        (err) => {
          pool.release(resource);
          throw err;
        },
      );
  };

  return pool;
};

export const pool = createPuppeteerPool();
