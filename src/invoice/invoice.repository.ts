import { Repository } from 'src/utils/repository.generic';
import { Invoice, InvoiceDocument } from './entities/invoice.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceRepository extends Repository<InvoiceDocument> {
	constructor(@InjectModel(Invoice.name) private entity: Model<InvoiceDocument>) {
		super(entity);
	}

	async createMany(invoices: Invoice[]): Promise<Omit<Invoice, '_id'>[] | undefined> {
		const result = await this.entity.insertMany(invoices);
		return result;
	}
}
