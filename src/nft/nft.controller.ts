import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NftService } from './nft.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from 'src/user/entities/user.entity';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post()
  create(@Body() createNftDto: CreateNftDto, @AuthedUser() user) {
    console.log('User creating NFT:', user);
    console.log('Create NFT DTO:', createNftDto);
    return this.nftService.create(createNftDto, user.id);
  }

  @Post('like/:id')
  like(@Param('id') id: string, @AuthedUser() user: User) {
    return this.nftService.likeNft(+id, user);
  }

  @Get()
  findAll() {
    return this.nftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nftService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
    return this.nftService.update(+id, updateNftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nftService.remove(+id);
  }
}
