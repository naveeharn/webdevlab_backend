import { User } from 'src/users/entities/user.entity';

export class CreateInvoiceDto {
	user: User;
	year: number;
	paymentType: string;
	tablePosition: string;
	cost: number;
	slipPaymentURL: string;
}
