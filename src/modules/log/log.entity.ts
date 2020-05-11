import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { CustomResponse } from 'src/interfaces/custom-response.interface';
@Entity()
export class Log {
    constructor(id?: string) {
        this.id = id;
    }
    @PrimaryColumn({ unique: true })
    id: string = v4();

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date = new Date();

    @Column({ name: 'operator_id' })
    operatorId: string;

    @Column('simple-json')
    request: CustomRequest;

    @Column('simple-json')
    response: CustomResponse;
    @Column()
    content: string;
}
