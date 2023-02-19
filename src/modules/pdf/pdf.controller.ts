import { Controller, Post, Param, Body } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from './pdf.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('PDF')
@Controller('users/:userId/pdfs')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @ApiOperation({ summary: 'create pdf' })
  @Post()
  async create(
    @Param('userId') userId: string,
    @Body() data: CreatePdfDto,
  ) {
    return this.pdfService.createPdf(userId, data);
  }
}
