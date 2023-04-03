import { IsNotEmpty } from "class-validator";
import { Column } from "typeorm";

export class UserGameStat {
  @Column()
  @IsNotEmpty()
  player1:string
  @Column()
  @IsNotEmpty()
  player2:string

  @Column()
  @IsNotEmpty()
  nameGame: string
  @Column()
  @IsNotEmpty()
  winner:string
  @Column()
  @IsNotEmpty()
  loser:string

  @Column()
  @IsNotEmpty()
  scoreWinner: number
  @Column()
  @IsNotEmpty()
  scoreLoser: number
  @Column()
  @IsNotEmpty()
  timeOfGame: number
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