import { buildProviderModule } from 'inversify-binding-decorators';
import { iocContainer } from '../common/inversify.config';


export * from './queueController';
export * from './userController';
export * from './groupController';
export * from './exampleController';
export * from './discordController';
iocContainer.load(buildProviderModule());