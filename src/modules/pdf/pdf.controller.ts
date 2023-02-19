import {
  Controller,
  Post
} from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
    constructor(private pdfService: PdfService) {}

    @Post()
    async create(){
        return this.pdfService.createPdf();
    }
}
