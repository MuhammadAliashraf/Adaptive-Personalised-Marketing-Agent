import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Typography {
  heading: string;
  body: string;
}

/** Brand identity & guardrails injected into every AI generation prompt. */
@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  tagline: string | null;

  @Column({ type: 'text', nullable: true })
  mission: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  voice: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  tone: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  valueProps: string[];

  @Column({ type: 'jsonb', nullable: true })
  colorPalette: ColorPalette | null;

  @Column({ type: 'jsonb', nullable: true })
  typography: Typography | null;

  @Column({ type: 'simple-array', default: '' })
  approvedThemes: string[];

  @Column({ type: 'simple-array', default: '' })
  restrictedKeywords: string[];

  @Column({ type: 'text', nullable: true })
  targetAudience: string | null;

  @Column({ type: 'simple-array', default: '' })
  productCategories: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isDefault: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
