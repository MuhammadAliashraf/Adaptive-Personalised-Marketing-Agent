import { Repository } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { Brand } from './brand.entity';

class BrandRepository {
  private get repo(): Repository<Brand> {
    return AppDataSource.getRepository(Brand);
  }

  findAll(): Promise<Brand[]> {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  findById(id: string): Promise<Brand | null> {
    return this.repo.findOne({ where: { id } });
  }

  findDefault(): Promise<Brand | null> {
    return this.repo.findOne({ where: { isDefault: true } });
  }

  save(brand: Partial<Brand>): Promise<Brand> {
    return this.repo.save(this.repo.create(brand));
  }
}

export const brandRepository = new BrandRepository();
