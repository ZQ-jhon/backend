import { Photo } from "../entity/Photo.entity";
import { User } from "../entity/User.entity";
export function buildPhoto(user: User) {
    const photo = new Photo();
    photo.name = 'photo';
    photo.description = "photo";
    photo.filename = "xxx.png";
    photo.views = Math.round(Math.random() * 10);
    photo.isPublished = false;
    photo.user = user;
    return photo;
}