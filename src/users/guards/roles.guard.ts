import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from 'src/utils/role.enum';

// @Injectable()
export class RolesGuard implements CanActivate {
	private reflector: Reflector = new Reflector();

	canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<RoleName[]>('roles', context.getHandler());
		if (!roles) {
			return Promise.resolve(true);
		}
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const intersect_roles = (user.roles as RoleName[]).filter((role) => roles.includes(role));
		if (intersect_roles.length == 0) {
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	}
}
