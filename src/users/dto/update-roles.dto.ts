import { RoleName } from 'src/utils/role.enum';
import { UserRoles } from '../interfaces/user-role.interface';

export default class UpdateRolesDto {
	// update_roles: UserRoles[];
	update_roles: RoleName[];
}
