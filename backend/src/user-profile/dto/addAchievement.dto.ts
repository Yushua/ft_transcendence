import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class AddAchievement {
    @Column()
    @IsNotEmpty()
    nameAchievement: string;
    @IsNotEmpty()
    @Column()
    pictureLink: string;
    @IsNotEmpty()
    @Column()
    message: string;
}

/*
  async findAll(): Promise<Parent[]> {
    return this.parentRepository.find({ relations: ['children'] });
  }

  async create(parentDto: CreateParentDto): Promise<Parent> {
    const parent = new Parent();
    parent.name = parentDto.name;
    parent.children = [];

    return this.parentRepository.save(parent);
  }
*/