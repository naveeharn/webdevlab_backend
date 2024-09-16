import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
		try {
		  const user = await this.usersRepository.findByEmail(newUser.email);
		  if (user) {
			throw new BadRequestException('Email address is already in use');
		  }
		
		  //  ตรวจสอบว่า newUser.roles ไม่เป็น null และไม่ว่างเปล่า
		  if (!newUser.roles || newUser.roles.length === 0) {
			throw new BadRequestException('Roles are required');
		  }
		  // กรองเฉพาะค่าที่มีอยู่ใน enum RoleName
		  const validRoles = newUser.roles.filter(role => Object.values(RoleName).includes(role));
		  
		  if (validRoles.length !== newUser.roles.length) {
			throw new BadRequestException('Invalid role values');
		  }
	  
		  const createdUser: CreateModel = await this.usersRepository.create(newUser);
		  return createdUser;
		} catch (error) {
		  throw new BadRequestException('Error creating user: ' + error.message);
		}
	  }

	// async findByEmail(email: string): Promise<User | undefined> {
	// 	// const user = this.users.find((user: User) => user.email === email);
	// 	const user = await this.usersRepository.findByEmail(email);
	// 	if (!user) {
	// 		return undefined;
	// 	}
	// 	return Promise.resolve(user);
	// }

	async findByEmail(email: string): Promise<User | undefined> {
		try {
		  const user = await this.usersRepository.findByEmail(email);
		  if (!user) {
			return undefined;
		  }
		  return user;
		} catch (error) {
		  throw new InternalServerErrorException('Error finding user by email: ' + error.message);
		}
	  }

	async findOne(id: string): Promise<User | undefined> {
		const user = await this.usersRepository.findById(id);
		// const user = this.users.find((user: User) => user._id === id);
		if (!user) {
			throw new BadRequestException(id,"Not Found")
			return undefined;
		}
		return Promise.resolve(user);
	}

	async updatedRoles(id: string, updateRoles: RoleName[]): Promise<UpdatedModel | undefined> {
		// กรองเฉพาะค่าที่มีอยู่ใน enum RoleName
		const validRoles = updateRoles.filter(role => Object.values(RoleName).includes(role));
		
		if (validRoles.length !== updateRoles.length) {
		  throw new BadRequestException('Invalid role values');
		}
	  
		const updatedModel = await this.usersRepository.updateOne({ _id: id }, { roles: validRoles });
		return updatedModel;
	  }
	  
}
