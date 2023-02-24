import { Controller, Post, Body, StreamableFile, Header, Res, Response,HttpCode,HttpStatus ,HttpException,Logger} from '@nestjs/common';
import { AppService } from './app.service';

interface Config {
  url: string;
  name?: string;
  scale?: number;
  format: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('render')
  @HttpCode(200)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=file.pdf')
  async renderPdf(@Body() dto: Config) {

    const url = new URL(dto.url);
    const searchParams = url.searchParams as any;

	try{
	    const buffer = await this.appService.renderPdf(dto.url, searchParams.get('format') || dto.format, searchParams.get('orientation') || "portrait", dto.scale,);
		return new StreamableFile(buffer, {
		  type: 'application/pdf',
		  disposition: `inline; filename=file.pdf`,
		});
	}catch(error){
		Logger.error(`error3 =================================${dto.url}`);

		throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
	}
   
  }
}
