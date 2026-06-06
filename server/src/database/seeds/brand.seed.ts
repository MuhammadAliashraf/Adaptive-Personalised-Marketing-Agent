import { EntityManager } from 'typeorm';
import { Brand } from '@modules/brand/brand.entity';

export async function seedBrand(manager: EntityManager): Promise<Brand> {
  const repo = manager.getRepository(Brand);
  const existing = await repo.findOne({ where: { isDefault: true } });
  if (existing) return existing;

  return repo.save(
    repo.create({
      name: 'Lumen & Co.',
      tagline: 'Light up the everyday.',
      mission: 'Make beautifully designed home lighting accessible to everyone.',
      voice: 'warm, confident',
      tone: 'friendly, premium',
      valueProps: ['Designer quality', 'Energy efficient', 'Free returns'],
      colorPalette: { primary: '#1A1A2E', secondary: '#E94560', accent: '#F5C518' },
      typography: { heading: 'Poppins', body: 'Inter' },
      approvedThemes: ['cozy living', 'sustainability', 'modern design'],
      restrictedKeywords: ['cheapest', 'guaranteed', 'miracle'],
      targetAudience: 'Design-conscious urban homeowners, 25–45.',
      productCategories: ['Pendant lights', 'Lamps', 'Smart bulbs', 'Outdoor'],
      logoUrl: 'https://placehold.co/200x80?text=Lumen',
      isDefault: true,
    }),
  );
}
