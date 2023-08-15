import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.ACCESS_SECRET,
		});
	}
	async validate(payload) {
		// console.log(payload);
		const { userId } = payload;
		const user = await this.userService.findOne(userId);
		// console.log(user);
		return user;
		// return {
		// 	userId: payload.userId,
		// 	roles: payload.roles,
		// };
	}
}
