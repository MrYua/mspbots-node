import {
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { PaperFormat } from 'puppeteer';

type DeviceFormat = 'SERVICE' | 'FRONTED';

export class CreatePdfDto {
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsIn([
    'LETTER',
    'LEGAL',
    'TABLOID',
    'LEDGER',
    'A0',
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'Letter',
    'Legal',
    'Tabloid',
    'Ledger',
  ])
  @IsOptional()
  format?: PaperFormat;

  @IsBoolean()
  printBackground?: boolean;

  @IsNumber()
  scale?: number;

  @IsBoolean()
  landscape?: boolean;

  @IsString()
  @IsIn(['SERVICE', 'FRONTED'])
  @IsOptional()
  device?: DeviceFormat;
}
