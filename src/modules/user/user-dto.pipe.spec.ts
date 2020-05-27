import { UserDtoPipe } from './user-dto.pipe';

describe('TokenPipePipe', () => {
    it('should be defined', () => {
        expect(new UserDtoPipe()).toBeDefined();
    });
});
