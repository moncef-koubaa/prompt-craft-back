import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from './entities/nft.entity';
import { DeepPartial, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Auction } from 'src/auction/entities/auction.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationDto } from 'src/notification/notification.dto';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    private readonly notficationService: NotificationService
  ) {}
  async create(createNftDto: CreateNftDto, userId: number) {
    createNftDto.ownerId = userId;
    createNftDto.creatorId = userId;
    let auctions: Auction[] = [];
    if (!createNftDto.auctionIds || createNftDto.auctionIds.length > 0) {
      auctions = await this.auctionRepository
        .createQueryBuilder('auction')
        .where('auction.id IN (:...ids)', { ids: createNftDto.auctionIds })
        .getMany();
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: createNftDto.ownerId })
      .getOne();
    const creator = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: createNftDto.creatorId })
      .getOne();
    const nft = this.nftRepository.create({
      ...createNftDto,
      auctions: auctions,
      owner: user,
      creator: creator,
    } as DeepPartial<Nft>);
    return await this.nftRepository.save(nft);
  }

  async findAll() {
    return await this.nftRepository
      .createQueryBuilder('nft')
      .leftJoinAndSelect('nft.auctions', 'auction')
      .leftJoinAndSelect('nft.owner', 'owner')
      .leftJoinAndSelect('nft.creator', 'creator')
      .getMany();
  }

  async findOne(id: number) {
    return await this.nftRepository
      .createQueryBuilder('nft')
      .leftJoinAndSelect('nft.auctions', 'auction')
      .leftJoinAndSelect('nft.owner', 'owner')
      .leftJoinAndSelect('nft.creator', 'creator')
      .where('nft.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateNftDto: UpdateNftDto) {
    this.nftRepository
      .createQueryBuilder()
      .update(Nft)
      .set(updateNftDto)
      .where('id = :id', { id })
      .execute();
    return await this.nftRepository
      .createQueryBuilder('nft')
      .leftJoinAndSelect('nft.auctions', 'auction')
      .leftJoinAndSelect('nft.owner', 'owner')
      .leftJoinAndSelect('nft.creator', 'creator')
      .where('nft.id = :id', { id })
      .getOne()
      .then((nft) => {
        if (!nft) {
          throw new Error('NFT not found');
        }
        return nft;
      });
  }

  async makeOnAuction(id: number) {
    const nft = await this.nftRepository.findOneBy({ id });
    if (nft) {
      nft.isOnAuction = true;
      return await this.nftRepository.save(nft);
    }
  }

  remove(id: number) {
    return this.nftRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new Error('NFT not found');
      }
      return result;
    });
  }

  async transferNft(id: number, newOwnerId: number) {
    const nft = await this.nftRepository.findOneBy({ id });
    const newOwner = await this.userRepository.findOneBy({ id: newOwnerId });
    if (nft && newOwner) {
      nft.owner = newOwner;
      return await this.nftRepository.save(nft);
    }
  }

  async likeNft(id: number, userId: number) {
    const nft = await this.nftRepository.findOneBy({ id });
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
    nft.likeCount++;
    await this.nftRepository.save(nft);
    const notification: NotificationDto = {
      nftId: id,
      type: 'like',
      message: `Nft ${nft.name} has been liked.`,
      userId: userId,
    };
    this.notficationService.sendNotification(notification);
  }
}
