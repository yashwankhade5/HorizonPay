use anchor_lang::prelude::*;
use crate::state::MerchantPda;
use crate::error::HorizonErrorCode;

/// Advances the merchant escrow circular buffer.
///
/// Rules:
/// - 1 day elapsed => release one bucket
/// - N days elapsed => release N buckets
/// - >= 7 days elapsed => release all buckets
///
/// Maintains invariant:
/// total_amount = withdrawable_amount + withheld_amount
pub fn advance_escrow(merchant: &mut MerchantPda , now_ts: i64) -> Result<(u8, u64)> {
    if merchant.current_date == 0 {
        merchant.current_date = now_ts;
        return Ok((0, 0));
    }

    let seconds_per_day: i64 = 86400;
    let diff_days = ((now_ts - merchant.current_date) / seconds_per_day) as u8;

    if diff_days == 0 {
        return Ok((0, 0));
    }

    let mut total_released: u64 = 0;

    if diff_days >= 7 {
        // Release all withheld buckets
        for i in 0..7 {
            total_released = total_released
                .checked_add(merchant.withheld_buckets[i])
                .ok_or(HorizonErrorCode::MathOverflow)?;
            merchant.withheld_buckets[i] = 0;
        }

        merchant.current_index = 0;
    } else {
        // Advance one slot per missed day
        for _ in 0..diff_days {
            merchant.current_index = (merchant.current_index + 1) % 7;

            let bucket_amount = merchant.withheld_buckets[merchant.current_index as usize];

            total_released = total_released
                .checked_add(bucket_amount)
                .ok_or(HorizonErrorCode::MathOverflow)?;

            merchant.withheld_buckets[merchant.current_index as usize] = 0;
        }
    }

    merchant.withheld_amount = merchant
        .withheld_amount
        .checked_sub(total_released)
        .ok_or(HorizonErrorCode::MathOverflow)?;

    merchant.withdrawable_amount = merchant
        .withdrawable_amount
        .checked_add(total_released)
        .ok_or(HorizonErrorCode::MathOverflow)?;

    merchant.current_date = now_ts;

    Ok((diff_days, total_released))
}