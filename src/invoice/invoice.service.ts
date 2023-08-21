import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/utils/role.enum';
import { InvoiceRepository } from './invoice.repository';

@Injectable()
export class InvoiceService {
	constructor(private readonly invoiceRepository: InvoiceRepository, private readonly usersService: UsersService) {}

	create(createInvoiceDto: CreateInvoiceDto) {
		return 'This action adds a new invoice';
	}

	async createManyByYear(year: number) {
		const old_invoices: Invoice[] = await this.invoiceRepository.find({ year: year });
		if (old_invoices.length) {
			throw new BadRequestException(`the year ${year}-th invoices already have existed`);
		}

		const users: User[] = await this.usersService.findByRole(RoleName.Member);

		const invoices: Invoice[] = [];
		for (const user of users) {
			const invoice: CreateInvoiceDto = {
				user: user,
				year: year,
				paymentType: !user.tablePosition ? 'Normal' : 'Desktop',
				tablePosition: !user.tablePosition ? 'None' : user.tablePosition,
				cost: !user.tablePosition ? 300 : 500,
				slipPaymentURL: 'http://minio-dev',
			};
			invoices.push(invoice as Invoice);
		}

		return await this.invoiceRepository.createMany(invoices);
	}

	findAll() {
		return `This action returns all invoice`;
	}

	findOne(id: number) {
		return `This action returns a #${id} invoice`;
	}

	update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
		return `This action updates a #${id} invoice`;
	}

	remove(id: number) {
		return `This action removes a #${id} invoice`;
	}
}
