import { sign } from 'jsonwebtoken';

class RefreshToken {
	constructor(init?: Partial<RefreshToken>) {
		Object.assign(this, init);
	}

	id: number;
	userId: string;
	ipAddress: string;

	sign(): string {
		return sign({ ...this }, process.env.REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRES_IN });
	}
}

export default RefreshToken;
