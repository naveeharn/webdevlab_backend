import { SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { NotAcceptableException } from '@nestjs/common';

export const UserSchema = SchemaFactory.createForClass(User).post('save', function (error, doc, next) {
	if (error.name === 'MongoServerError' && error.code === 11000) {
		next(new NotAcceptableException('User Constraint'));
	} else {
		next(error);
	}
});
