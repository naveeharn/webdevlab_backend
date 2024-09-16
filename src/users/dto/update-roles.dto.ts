import { RoleName } from 'src/utils/role.enum';
import { UserRoles } from '../interfaces/user-role.interface';
import { IsArray, IsEnum } from 'class-validator';

export default class UpdateRolesDto {
	// update_roles: UserRoles[];
	@IsArray()
  	@IsEnum(RoleName, { each: true })
	update_roles: RoleName[];
}
