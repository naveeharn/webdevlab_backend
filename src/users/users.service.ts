import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RoleName } from 'src/utils/role.enum';
import { UsersRepository } from './users.repository';
import { CreateModel, UpdatedModel } from 'src/utils/detail.entity';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	private users: User[] = [
		{
			_id: '0',
			name: 'admin',
			email: 'admin@networklab.com',
			password: 'admin-pass',
			roles: [RoleName.Admin],
		},
		{
			_id: '1',
			name: 'Bob',
			email: 'bob@gmail.com',
			password: 'bob-pass',
			roles: [RoleName.Member],
		},
		{
			_id: '2',
			name: 'John',
			email: 'john@gmail.com',
			password: 'john-pass',
			roles: [RoleName.Member],
		},
		{
			_id: '3',
			name: 'Gary',
			email: 'gary@gmail.com',
			password: 'gary-pass',
			roles: [RoleName.Member],
		},
		{
			_id: '4',
			name: 'Naveeharn',
			email: '63010523@kmitl.ac.th',
			password: 'naveeharn-pass',
			roles: [RoleName.Member],
		},
	];

	async create(newUser: User): Promise<CreateModel | undefined> {
		const user = await this.usersRepository.findByEmail(newUser.email);
		if (user) {
			throw new BadRequestException('email has already existed');
		}
		const createdUser: CreateModel = await this.usersRepository.create(newUser);
		return createdUser;
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
		const updatedModel = await this.usersRepository.updateOne({ _id: id }, { roles: updateRoles });
		return updatedModel;
		// const user = this.users.find((user: User) => user._id == id);
		// this.users[user._id].roles = [...new Set(...[updateRoles])];
		// return Promise.resolve(this.users[id]);
	}
}
