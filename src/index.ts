import "reflect-metadata";
import {createConnection} from "typeorm";
import { Photo } from "./entity/Photo.entity";
import { buildPhoto } from "./factories/build-photo";
import { User } from "./entity/User.entity";
import { buildUser } from "./factories/build-user";
createConnection().then(async connection => {
    const photoRepo = connection.getRepository(Photo);
    const userRepo = connection.getRepository(User);

    // 工厂 
    const user = buildUser();
    const photo = buildPhoto(user);

    // 按照依赖关系来 save
    userRepo.save(user);
    photoRepo.save(photo);

    console.log(await userRepo.find({ relations: ['photo']}));
    console.log(await photoRepo.find());

}).catch(error => console.log(error));
