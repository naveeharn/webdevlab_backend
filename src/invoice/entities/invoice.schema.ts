import { SchemaFactory } from '@nestjs/mongoose';
import { Invoice } from './invoice.entity';
import { NotAcceptableException } from '@nestjs/common';

export const InvoiceSchema = SchemaFactory.createForClass(Invoice).post('save', function (error, doc, next) {
	if (error.name === 'MongoServerError' && error.code === 11000) {
		next(new NotAcceptableException('Invoice Constraint'));
	} else {
		next(error);
	}
});
