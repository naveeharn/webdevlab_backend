import { SetMetadata } from '@nestjs/common';
import { RoleName } from 'src/utils/role.enum';

// export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
