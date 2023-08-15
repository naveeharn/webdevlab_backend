import { Repository } from 'src/utils/repository.generic';
import { User, UserDocument } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends Repository<UserDocument> {
	constructor(@InjectModel(User.name) private entity: Model<UserDocument>) {
		super(entity);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return await this.entity.findOne({ email });
	}
}
