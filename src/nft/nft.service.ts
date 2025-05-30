import { Injectable } from "@nestjs/common";
import { CreateNftDto } from "./dto/create-nft.dto";
import { UpdateNftDto } from "./dto/update-nft.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Nft } from "./entities/nft.entity";
import { DeepPartial, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Auction } from "src/auction/entities/auction.entity";

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>
  ) {}
  async create(createNftDto: CreateNftDto) {
    const auctions = await this.auctionRepository
      .createQueryBuilder("auction")
      .where("auction.id IN (:...ids)", { ids: createNftDto.auctionIds })
      .getMany();
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: createNftDto.ownerId })
      .getOne();
    const creator = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: createNftDto.creatorId })
      .getOne();
    const nft = this.nftRepository.create({
      ...createNftDto,
      auctions: auctions,
      owner: user,
      creator: creator,
    } as DeepPartial<Nft>);
    await this.nftRepository.save(nft);
  }

  async findAll() {
    return await this.nftRepository
      .createQueryBuilder("nft")
      .leftJoinAndSelect("nft.auctions", "auction")
      .leftJoinAndSelect("nft.owner", "owner")
      .leftJoinAndSelect("nft.creator", "creator")
      .getMany();
  }

  async findOne(id: number) {
    return await this.nftRepository
      .createQueryBuilder("nft")
      .leftJoinAndSelect("nft.auctions", "auction")
      .leftJoinAndSelect("nft.owner", "owner")
      .leftJoinAndSelect("nft.creator", "creator")
      .where("nft.id = :id", { id })
      .getOne();
  }

  async update(id: number, updateNftDto: UpdateNftDto) {
    this.nftRepository
      .createQueryBuilder()
      .update(Nft)
      .set(updateNftDto)
      .where("id = :id", { id })
      .execute();
    return await this.nftRepository
      .createQueryBuilder("nft")
      .leftJoinAndSelect("nft.auctions", "auction")
      .leftJoinAndSelect("nft.owner", "owner")
      .leftJoinAndSelect("nft.creator", "creator")
      .where("nft.id = :id", { id })
      .getOne()
      .then((nft) => {
        if (!nft) {
          throw new Error("NFT not found");
        }
        return nft;
      });
  }

  remove(id: number) {
    return this.nftRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new Error("NFT not found");
      }
      return result;
    });
  }
}
