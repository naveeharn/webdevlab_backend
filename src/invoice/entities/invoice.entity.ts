import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { RateType } from 'src/utils/rate-type.invoice';

@Schema({ timestamps: true })
export class Invoice {
	_id: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	user: User;

	@Prop({ type: Number })
	year: number;

	@Prop({ type: String, enum: RateType, default: RateType.Normal })
	paymentType: RateType;

	@Prop({ type: String, required: false })
	tablePosition: string | undefined;

	@Prop({ type: Number })
	cost: number;

	@Prop({ type: String })
	slipPaymentURL: string;
}

export type InvoiceDocument = Invoice & Document;
