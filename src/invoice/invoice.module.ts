import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice } from './entities/invoice.entity';
import { InvoiceSchema } from './entities/invoice.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]), UsersModule],
	controllers: [InvoiceController],
	providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
