import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import UpdateRolesDto from './dto/update-roles.dto';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { User } from './entities/user.entity';
import { RoleName } from 'src/utils/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('me')
	@ApiBearerAuth()
	me(@Req() request, @CurrentUser() user: User) {
		// const userId = request.user.id;
		return this.usersService.findOne(user._id);
	}

	@Post()
	@Roles(RoleName.Admin)
	async createNewUser(@Body() user: User) {
		return await this.usersService.create(user);
	}

	@Get(':userId')
	@Roles(RoleName.Member)
	async getUserById(@Param('userId') userId: string) {
		const result = await this.usersService.findOne(userId);
		return result;
	}

	@Patch(':userId/roles')
	@Roles(RoleName.Admin)
	async updateRoles(@Param('userId') userId: string, @Body() body: UpdateRolesDto, @CurrentUser() user: User) {
		// console.log(user);
		const updatedUser = await this.usersService.updatedRoles(userId, body.update_roles);
		return updatedUser;
	}
}
