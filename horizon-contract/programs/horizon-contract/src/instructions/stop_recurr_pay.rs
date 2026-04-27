use crate::{state::*, HorizonErrorCode};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct StopRecurrPay<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub admin: Account<'info, AdminPda>,

    #[account(
        mut,
        seeds = [b"merchant", merchant_pda.merchant.as_ref(), admin.key().as_ref()],
        bump = merchant_pda.bump
    )]
    pub merchant_pda: Account<'info, MerchantPda>,

    #[account(
        mut,
        close = signer,
        seeds = [b"subscription", recurring_pda.subscriber.as_ref(), merchant_pda.key().as_ref()],
        bump = recurring_pda.bump
    )]
    pub recurring_pda: Account<'info, RecurringPda>,
}

impl<'info> StopRecurrPay<'info> {
    pub fn stop_recurr_pay(&mut self) -> Result<()> {
        require!(
            self.signer.key() == self.recurring_pda.subscriber,
            HorizonErrorCode::Unauthorized
        );

        Ok(())
    }
}