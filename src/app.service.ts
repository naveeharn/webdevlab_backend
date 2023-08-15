import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		console.log(new Date().toISOString());
		return `Hello World! ${new Date().toISOString()}`;
	}
}
