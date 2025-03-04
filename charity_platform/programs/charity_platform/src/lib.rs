use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Token};
use solana_program::native_token::LAMPORTS_PER_SOL;

declare_id!("EzHYHmD5vextLENwqzUuWwcFNkhUmEEcSyipYm6hhajN");

#[program]
pub mod charity_nft_platform {
    use super::*;

    /// Initialisation du programme avec la configuration de la charité
    pub fn initialize(
        ctx: Context<Initialize>,
        charity_wallet: Pubkey,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.charity_wallet = charity_wallet;
        config.reward_token_mint = ctx.accounts.reward_token_mint.key();
        Ok(())
    }

    /// Achat d'un NFT : transfert de SOL vers la charité, mint du NFT et attribution de tokens de récompense.
    pub fn purchase_nft(
        ctx: Context<PurchaseNFT>,
        price: u64,          // en lamports (1 SOL = 1_000_000_000 lamports)
        metadata_uri: String, // URL des métadonnées du NFT (pour Metaplex, à intégrer ultérieurement)
        title: String,        // Titre ou nom du NFT
    ) -> Result<()> {
        // Vérifier que le prix est entre 1 SOL et 5 SOL
        let min_price = 1 * LAMPORTS_PER_SOL;
        let max_price = 5 * LAMPORTS_PER_SOL;
        if price < min_price || price > max_price {
            return Err(ErrorCode::InvalidPrice.into());
        }

        // Transfert de SOL du buyer vers le portefeuille de charité.
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.buyer.key,
            &ctx.accounts.config.charity_wallet,
            price,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.charity_wallet.to_account_info(),
            ],
        )?;

        // --- Mint du NFT ---
        let cpi_accounts = MintTo {
            mint: ctx.accounts.nft_mint.to_account_info(),
            to: ctx.accounts.buyer_nft_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, 1)?;

        // --- Distribution des tokens de récompense ---
        // Calcul : 10 tokens par SOL donné.
        let reward_amount = (price / LAMPORTS_PER_SOL) * 10;
        let cpi_accounts_reward = MintTo {
            mint: ctx.accounts.reward_token_mint.to_account_info(),
            to: ctx.accounts.buyer_reward_token_account.to_account_info(),
            authority: ctx.accounts.reward_mint_authority.to_account_info(),
        };
        let cpi_ctx_reward = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts_reward);
        token::mint_to(cpi_ctx_reward, reward_amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 32)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: Ce compte est utilisé uniquement pour recevoir des fonds.
    pub charity_wallet: UncheckedAccount<'info>,
    /// CHECK: Le mint du token de récompense doit être créé préalablement et est supposé être valide.
    #[account(mut)]
    pub reward_token_mint: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct PurchaseNFT<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub config: Account<'info, Config>,
    /// CHECK: Ce compte représente le portefeuille de charité.
    #[account(mut, address = config.charity_wallet)]
    pub charity_wallet: UncheckedAccount<'info>,
    /// CHECK: Mint du token de récompense (doit correspondre à celui du config).
    #[account(mut, address = config.reward_token_mint)]
    pub reward_token_mint: UncheckedAccount<'info>,
    /// CHECK: Autorité de mint pour les tokens de récompense (peut être un PDA).
    #[account(mut)]
    pub reward_mint_authority: Signer<'info>,
    /// CHECK: Compte associé de l'acheteur pour recevoir les tokens de récompense.
    #[account(mut)]
    pub buyer_reward_token_account: UncheckedAccount<'info>,
    /// CHECK: Mint du NFT à créer.
    #[account(mut)]
    pub nft_mint: UncheckedAccount<'info>,
    /// CHECK: Autorité autorisée à mint le NFT (souvent un PDA généré par le programme).
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    /// CHECK: Compte associé de l'acheteur pour recevoir le NFT.
    #[account(mut)]
    pub buyer_nft_account: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

/// Stocke la configuration du programme.
#[account]
pub struct Config {
    pub charity_wallet: Pubkey,
    pub reward_token_mint: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Prix invalide : le NFT doit coûter entre 1 et 5 SOL.")]
    InvalidPrice,
}
