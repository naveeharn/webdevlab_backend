import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RoleName } from 'src/utils/role.enum';
import { UsersRepository } from './users.repository';
import { CreateModel, UpdatedModel } from 'src/utils/detail.entity';
import { FilterQuery, QueryOptions } from 'mongoose';

@Injectable()
export class UsersService {
	private readonly roleCount = {
		admin: process.env.ADMIN_COUNT,
		headofyear: process.env.HEADOF_YEAR_COUNT,
	};
	constructor(private readonly usersRepository: UsersRepository) {}

	async create(newUser: User): Promise<CreateModel | undefined> {
		const user = await this.usersRepository.findByEmail(newUser.email);
		// const user = await this.usersRepository.find({ email: newUser.email });
		if (user) {
			throw new BadRequestException('email has already existed');
		}
		const messgaes = await this.checkAvailableRoles(newUser.roles);
		if (messgaes.length) {
			throw new BadRequestException(messgaes.map((value) => value.message));
		}
		const createdUser: CreateModel = await this.usersRepository.create(newUser);
		return createdUser;
	}

	async find(filter: FilterQuery<User>, options?: QueryOptions): Promise<User[] | undefined> {
		return await this.usersRepository.find(filter, options);
	}

	async findByEmail(email: string): Promise<User | undefined> {
		// const user = this.users.find((user: User) => user.email === email);
		const user = await this.usersRepository.findByEmail(email);
		if (!user) {
			return undefined;
		}
		return Promise.resolve(user);
	}

	async findOne(id: string): Promise<User | undefined> {
		const user = await this.usersRepository.findById(id);
		// const user = this.users.find((user: User) => user._id === id);
		if (!user) {
			return undefined;
		}
		return Promise.resolve(user);
	}

	async updatedRoles(id: string, updateRoles: RoleName[]): Promise<UpdatedModel | undefined> {
		const messgaes = await this.checkAvailableRoles(updateRoles);
		if (messgaes.length) {
			throw new BadRequestException(messgaes.map((value) => value.message));
		}
		const updatedModel = await this.usersRepository.updateOne({ _id: id }, { roles: updateRoles });
		return updatedModel;
		// const user = this.users.find((user: User) => user._id == id);
		// this.users[user._id].roles = [...new Set(...[updateRoles])];
		// return Promise.resolve(this.users[id]);
	}

	async findByRole(role: string): Promise<User[] | undefined> {
		const result = await this.usersRepository.find({}, {});
		return result;
	}

	private async countUsersByRole(role: RoleName): Promise<{ count: number } | undefined> {
		return await this.usersRepository.countUsersByRole(role);
	}

	private async isLessThanRoleCount(role: RoleName): Promise<boolean> {
		const limit = this.roleCount[role];
		if (!limit) {
			return Promise.resolve(true);
		}
		const result = await this.countUsersByRole(role);
		if (result.count < limit) {
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	private async checkAvailableRoles(roles: RoleName[]): Promise<{ message: string }[] | undefined> {
		const messages: { message: string }[] = [];
		for (const role of roles) {
			const result = await this.isLessThanRoleCount(role);
			if (!result) {
				messages.push({ message: `${role} role can't be inserted because it's exceeded.` });
			}
		}
		return messages;
	}
}
