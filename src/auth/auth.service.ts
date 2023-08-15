import { Injectable, UnauthorizedException } from '@nestjs/common';
import RefreshToken from './entities/refresh-token.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { sign, verify } from 'jsonwebtoken';
import { Auth, google } from 'googleapis';

@Injectable()
export class AuthService {
	private refreshTokens: RefreshToken[] = [];
	private oauthClient: Auth.OAuth2Client;

	constructor(private readonly userService: UsersService) {
		const clientId = process.env.GOOGLE_CLIENTID;
		const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
		this.oauthClient = new google.auth.OAuth2(clientId, clientSecret);
	}

	async loginGoogleUser(
		token: string,
		values: { userAgent: string; ipAddress: string },
	): Promise<{ accessToken: string; refreshToken: string } | undefined> {
		const tokenInfo = await this.oauthClient.getTokenInfo(token);
		console.log(tokenInfo);
		const user = await this.userService.findByEmail(tokenInfo.email);
		if (!user) {
			return undefined;
		}
		return this.newRefreshAndAccessToken(user, values);
	}

	async refresh(refreshString: string): Promise<{ accessToken: string } | undefined> {
		const refreshToken = await this.retrieveRefreshToken(refreshString);
		if (!refreshToken) {
			return undefined;
		}
		const user = await this.userService.findOne(refreshToken.userId);
		if (!user) {
			return undefined;
		}
		const payload = {
			userId: refreshToken.userId,
			// roles: user.roles,
		};
		return {
			accessToken: sign(payload, process.env.ACCESS_SECRET, {
				// expiresIn: '1h',
				expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRES_IN,
			}),
		};
	}

	private retrieveRefreshToken(refreshString: string): Promise<RefreshToken | undefined> {
		try {
			const decoded = verify(refreshString, process.env.REFRESH_SECRET);
			if (typeof decoded === 'string') {
				return undefined;
			}
			return Promise.resolve(this.refreshTokens.find((token) => token.id === decoded.id));
		} catch (error) {
			return undefined;
		}
	}

	async login(
		email: string,
		password: string,
		values: { userAgent: string; ipAddress: string },
	): Promise<{ accessToken: string; refreshToken: string } | undefined> {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			// throw new UnauthorizedException()
			return undefined;
		}
		// verify your user -- use argon2 for password hashing
		if (user.password !== password) {
			return undefined;
		}
		return this.newRefreshAndAccessToken(user, values);
	}

	private async newRefreshAndAccessToken(
		user: User,
		values: { userAgent: string; ipAddress: string },
	): Promise<{ accessToken: string; refreshToken: string }> {
		const refreshObject = new RefreshToken({
			id: this.refreshTokens.length === 0 ? 0 : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
			...values,
			userId: user._id,
		});
		this.refreshTokens.push(refreshObject);
		const payload = {
			userId: user._id,
			// roles: user.roles,
		};
		return {
			accessToken: sign(payload, process.env.ACCESS_SECRET, {
				// expiresIn: '1h',
				expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRES_IN,
			}),
			refreshToken: refreshObject.sign(),
		};
	}

	async logout(refreshString: string): Promise<void> {
		const refreshToken = await this.retrieveRefreshToken(refreshString);
		if (!refreshToken) {
			return;
		}

		// delete refreshtoken from db
		this.refreshTokens = this.refreshTokens.filter((token) => token.id !== refreshToken.id);
	}
}
