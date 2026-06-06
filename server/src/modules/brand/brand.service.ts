import { NotFoundError } from '@common/errors';
import { Brand } from './brand.entity';
import { brandRepository } from './brand.repository';

class BrandService {
  list(): Promise<Brand[]> {
    return brandRepository.findAll();
  }

  /** Returns the default brand (the demo uses a single brand). */
  async getDefault(): Promise<Brand> {
    const brand = (await brandRepository.findDefault()) ?? (await brandRepository.findAll())[0];
    if (!brand) {
      throw new NotFoundError('No brand configured. Run the seeders.');
    }
    return brand;
  }

  async getById(id: string): Promise<Brand> {
    const brand = await brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundError('Brand not found');
    }
    return brand;
  }
}

export const brandService = new BrandService();
