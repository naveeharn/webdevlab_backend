import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';
import { RoleName } from 'src/utils/role.enum';

// export class User {
// 	id: string;
// 	name: string;
// 	email: string;
// 	password: string;
// 	roles: RoleName[];
// }

@Schema({ timestamps: true })
export class User {
	// @Prop({ virtual: };
	_id: string;

	@Prop({ type: String })
	name: string;

	@Prop({ type: String })
	email: string;

	@Prop({ type: String })
	password: string;

	@Prop({ type: String })
	tablePosition: string;

	@Prop({ type: [String], enum: RoleName, default: [RoleName.Member] })
	roles: RoleName[];
}

// export type UserDocument = HydratedDocument<User>;

export type UserDocument = User & Document;
