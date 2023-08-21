import { Repository } from 'src/utils/repository.generic';
import { User, UserDocument } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleName } from 'src/utils/role.enum';

@Injectable()
export class UsersRepository extends Repository<UserDocument> {
	constructor(@InjectModel(User.name) private entity: Model<UserDocument>) {
		super(entity);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		return await this.entity.findOne({ email });
	}

	async countUsersByRole(role: RoleName): Promise<{ count: number } | undefined> {
		const result = await this.entity.aggregate([
			{ $match: { roles: { $in: [role] } } },
			{ $group: { _id: 'None', count: { $sum: 1 } } },
			{ $unset: '_id' },
		]);
		return Promise.resolve({ count: result.length ? result[0]?.count : 0 });
	}
}
