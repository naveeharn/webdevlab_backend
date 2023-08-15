import { ObjectId } from 'mongoose';

export type UpdatedModel = {
	matchedCount: number;
	modifiedCount: number;
	acknowledged: boolean;
	upsertedId: unknown | ObjectId;
	upsertedCount: number;
};

export type RemovedModel = {
	id: string;
	deleted: boolean;
};

export type CreateModel = {
	id: string;
	created: boolean;
};
