use crate::{
    error::HorizonErrorCode,
    event::EscrowAdvanced,
    helpers::advance_escrow,
    state::MerchantPda,
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateWithdrawalAmount<'info> {
    #[account(
        mut,
        seeds = [b"merchant", merchant_pda.merchant.as_ref()],
        bump = merchant_pda.bump
    )]
    pub merchant_pda: Account<'info, MerchantPda>,
}

impl<'info> UpdateWithdrawalAmount<'info> {
    pub fn handler(&mut self) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let today = now / 86_400; // number of days since epoch

        //
        // 1. Enforce once-per-day update (spec: AlreadyUpdatedToday)
        //
        let last_updated_day = self.merchant_pda.current_date / 86_400;

        require!(
            today > last_updated_day,
            HorizonErrorCode::AlreadyUpdatedToday
        );

        //
        // 2. Perform escrow advancement
        //    (may advance 1–6 slots, or ≥7 = full reset)
        //
        let (slots_advanced, amount_released) =
            advance_escrow(&mut self.merchant_pda, now)?;

        //
        // 3. Update current_date AFTER advancement
        //
        self.merchant_pda.current_date = now;

        //
        // 4. Emit EscrowAdvanced event
        //
        emit!(EscrowAdvanced {
            merchant: self.merchant_pda.merchant,
            slots_advanced,
            amount_released,
            new_withdrawable: self.merchant_pda.withdrawable_amount,
            timestamp: now,
        });

        Ok(())
    }
}