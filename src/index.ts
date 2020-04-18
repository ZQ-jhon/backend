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

    console.log(await userRepo.find());
    console.log(await photoRepo.find());
    // 在 mysql 中查询，此时会发现 photo 表中多了一个外键 userId, 见 result.png

}).catch(error => console.log(error));
