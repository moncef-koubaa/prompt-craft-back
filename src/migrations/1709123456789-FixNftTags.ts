import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNftTags1709123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, let's see what we have
        const nfts = await queryRunner.query(`SELECT id, tags FROM nft`);
        
        // Update each NFT's tags to proper array format
        for (const nft of nfts) {
            let tags = nft.tags;
            // Remove curly braces and split by comma
            tags = tags.replace(/[{}]/g, '');
            const tagArray = tags.split(',').filter(tag => tag.trim() !== '');
            // Convert back to proper array format
            const formattedTags = `{${tagArray.join(',')}}`;
            
            await queryRunner.query(
                `UPDATE nft SET tags = $1 WHERE id = $2`,
                [formattedTags, nft.id]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No need for down migration
    }
} 