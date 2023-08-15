import {
	Document,
	FilterQuery,
	Model,
	QueryOptions,
	SaveOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from 'mongoose';
import { CreateModel, RemovedModel, UpdatedModel } from './detail.entity';

export class Repository<T extends Document> {
	constructor(private readonly model: Model<T>) {}

	async create(doc: object, saveOptions?: SaveOptions): Promise<CreateModel> {
		const createdEntity = new this.model(doc);
		const savedResult = await createdEntity.save(saveOptions);
		return Promise.resolve({ id: savedResult._id, created: !!savedResult._id });
	}

	async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
		return await this.model.find(filter, undefined, options);
	}

	async findById(id: string): Promise<T | undefined> {
		// console.log(id);
		// return undefined
		return this.model.findById(id);
	}

	async remove(filter: FilterQuery<T>): Promise<RemovedModel> {
		const { id } = await this.model.findOneAndRemove(filter);
		return { id, deleted: !!id };
	}

	async updateOne(
		filter: FilterQuery<T>,
		updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
		options?: QueryOptions,
	): Promise<UpdatedModel> {
		return await this.model.updateOne(filter, updated, options);
	}

	async updateMany(
		filter: FilterQuery<T>,
		updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
		options?: QueryOptions,
	): Promise<UpdatedModel> {
		return await this.model.updateMany(filter, updated, options);
	}
}
