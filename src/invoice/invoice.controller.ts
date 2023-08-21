import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { YearInvoiceDto } from './dto/year-invoice.dto';

@Controller('invoice')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	// @Post()
	// create(@Body() createInvoiceDto: CreateInvoiceDto) {
	// 	return this.invoiceService.create(createInvoiceDto);
	// }

	@Post()
	createManyByYear(@Body() body: YearInvoiceDto) {
		return this.invoiceService.createManyByYear(body.year);
	}

	@Get()
	findAll() {
		return this.invoiceService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.invoiceService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
		return this.invoiceService.update(+id, updateInvoiceDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.invoiceService.remove(+id);
	}
}
