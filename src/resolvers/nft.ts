import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { Nft } from "../nft/entities/nft.entity";
import { CreateNftDto } from "../nft/dto/create-nft.dto";
import { UpdateNftDto } from "../nft/dto/update-nft.dto";
import { Like, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { TagsInput } from "../nft/dto/tags.input";
import { Public } from "src/decorator/public.decorator";
import { NFTsResponse } from "src/nft/dto/NFTsResponse";
import { NftFilterDto } from "src/nft/dto/filter.dto";

@Resolver(() => Nft)
export class NftResolver {
  constructor(
    @InjectRepository(Nft)
    private nftRepository: Repository<Nft>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Public()
  @Mutation(() => Nft)
  async createNft(@Args("input") input: CreateNftDto): Promise<Nft> {
    const owner = await this.userRepository.findOne({
      where: { id: input.ownerId },
    });
    const creator = await this.userRepository.findOne({
      where: { id: input.creatorId },
    });
    if (!owner || !creator) {
      throw new Error("Owner or Creator not found");
    }
    const nft = this.nftRepository.create({
      ...input,
      owner: owner,
      creator: creator,
    });
    return this.nftRepository.save(nft);
  }

  @Public()
  @Mutation(() => Nft)
  async updateNft(@Args("input") input: UpdateNftDto): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: { id: input.id },
    });
    if (!nft) {
      throw new Error("NFT not found");
    }
    Object.assign(nft, input);
    return this.nftRepository.save(nft);
  }

  @Public()
  @Mutation(() => Boolean)
  async deleteNft(@Args("id") id: number): Promise<boolean> {
    const nft = await this.nftRepository.findOne({
      where: { id },
    });
    if (!nft) {
      throw new Error("NFT not found");
    }
    await this.nftRepository.remove(nft);
    return true;
  }
  @Public()
  @Query(() => NFTsResponse, { name: "getNfts" })
  async getNfts(@Args("filter") filter: NftFilterDto): Promise<NFTsResponse> {
    const skip = (filter.page - 1) * filter.limit;
    const take = filter.limit;
    const query = this.nftRepository.createQueryBuilder("nft");
    if (filter.search) {
      query.where("(nft.name LIKE :search OR nft.description LIKE :search)", {
        search: `%${filter.search}%`,
      });
    }
    if (filter.isOnAuction !== undefined) {
      query.andWhere("nft.isOnAuction = :isOnAuction", {
        isOnAuction: filter.isOnAuction,
      });
    }
    if (filter.isOnSale !== undefined) {
      query.andWhere("nft.isOnSale = :isOnSale", {
        isOnSale: filter.isOnSale,
      });
    }
    if (filter.priceLower !== undefined) {
      query.andWhere("nft.price >= :priceLower", {
        priceLower: filter.priceLower,
      });
    }
    if (filter.priceUpper !== undefined) {
      query.andWhere("nft.price <= :priceUpper", {
        priceUpper: filter.priceUpper,
      });
    }
    if (filter.description) {
      query.andWhere("nft.description LIKE :description", {
        description: `%${filter.description}%`,
      });
    }
    query.skip(skip).take(take);
    const [data, total] = await query.getManyAndCount();

    return {
      metadata: {
        page: filter.page,
        limit: filter.limit,
        total,
      },
      data,
    };
  }
  @Public()
  @Query(() => Nft)
  async getNft(@Args("id", { type: () => Int }) id: number): Promise<Nft> {
    const nft = await this.nftRepository.findOne({
      where: { id },
      relations: ["owner", "creator"],
    });
    if (!nft) {
      throw new Error("NFT not found");
    }
    return nft;
  }
  @Public()
  @Query(() => [Nft])
  async nftByDescription(
    @Args("description") description: string
  ): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { description: Like(`%${description}%`) } as any,
      relations: ["owner", "creator", "auctions"],
    });
  }
  @Public()
  @Query(() => [Nft])
  async nftsByTags(@Args("input") input: TagsInput): Promise<Nft[]> {
    const allNfts = await this.nftRepository.find({
      relations: ["owner", "creator", "auctions"],
    });
    const matchingNfts = allNfts.filter((nft) => {
      if (!nft.tags || !Array.isArray(nft.tags)) return false;
      const nftTags = nft.tags;
      return input.tags.some((tag) => nftTags.includes(tag));
    });
    return matchingNfts;
  }
}
