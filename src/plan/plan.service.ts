import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    const potentialPlanMatch = await this.planRepository.findOneBy({
      name: createPlanDto.name,
    });
    if (potentialPlanMatch) {
      throw new BadRequestException('Plan with this name already exists');
    }

    return this.planRepository.save(createPlanDto);
  }

  findAll() {
    return this.planRepository.find();
  }

  findOne(id: number) {
    return this.planRepository.findOneBy({ id });
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return this.planRepository.update(id, updatePlanDto);
  }

  remove(id: number) {
    return this.planRepository.delete(id);
  }
}
