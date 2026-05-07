use anchor_lang::prelude::*;

declare_id!("DUeqKHA2PZ3y4QBmJJstxYkWLZR15rLB9jxPNN12H3FH");

#[program]
pub mod zcg {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.owner = ctx.accounts.user.key();
        user_stats.name = name;
        user_stats.reputation = 100;
        user_stats.completed_assignments = 0;
        user_stats.completed_reviews = 0;
        user_stats.bump = ctx.bumps.user_stats;
        Ok(())
    }

    pub fn update_user(ctx: Context<UpdateUser>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.name = name;
        Ok(())
    }

    pub fn submit_assignment(ctx: Context<SubmitAssignment>, content_url: String) -> Result<()> {
        require!(content_url.len() <= 200, ZcgError::ContentUrlTooLong);
        let assignment = &mut ctx.accounts.assignment;
        assignment.student = ctx.accounts.user.key();
        assignment.content_url = content_url;
        assignment.status = AssignmentStatus::Submitted;
        assignment.average_grade = 0;
        assignment.review_count = 0;
        assignment.total_grade = 0;
        assignment.nft_minted = false;
        assignment.bump = ctx.bumps.assignment;
        Ok(())
    }

    pub fn submit_review(ctx: Context<SubmitReview>, grade: u8, comment: String) -> Result<()> {
        let assignment = &mut ctx.accounts.assignment;
        let user_stats = &mut ctx.accounts.user_stats;

        require!(assignment.status == AssignmentStatus::Submitted, ZcgError::AssignmentAlreadyFinalized);
        require!(user_stats.reputation >= 50, ZcgError::InsufficientReputation);
        require!(grade <= 100, ZcgError::InvalidGrade);
        require!(comment.len() <= 100, ZcgError::CommentTooLong);

        let review = &mut ctx.accounts.review;
        review.reviewer = ctx.accounts.user.key();
        review.assignment = assignment.key();
        review.grade = grade;
        review.comment = comment;
        review.bump = ctx.bumps.review;

        assignment.review_count += 1;
        assignment.total_grade += grade as u32;
        user_stats.completed_reviews += 1;

        if assignment.review_count >= 3 {
            assignment.status = AssignmentStatus::Finalized;
            assignment.average_grade = (assignment.total_grade / assignment.review_count as u32) as u8;
            user_stats.reputation += 10;
        } else {
            user_stats.reputation += 2;
        }

        Ok(())
    }

    pub fn create_channel(ctx: Context<CreateChannel>, name: String) -> Result<()> {
        msg!("Creating channel: {}", name);
        let channel = &mut ctx.accounts.channel;
        channel.creator = ctx.accounts.user.key();
        channel.name = name;
        channel.member_count = 1;
        channel.bump = ctx.bumps.channel;
        Ok(())
    }

    pub fn send_invite(ctx: Context<SendInvite>) -> Result<()> {
        msg!("Sending invite from {} to {}", ctx.accounts.user.key(), ctx.accounts.receiver.key());
        let invite = &mut ctx.accounts.invite;
        invite.sender = ctx.accounts.user.key();
        invite.receiver = ctx.accounts.receiver.key();
        invite.assignment = ctx.accounts.assignment.key();
        invite.status = InviteStatus::Pending;
        invite.bump = ctx.bumps.invite;
        Ok(())
    }

    pub fn finalize_assignment(ctx: Context<FinalizeAssignment>) -> Result<()> {
        let assignment = &mut ctx.accounts.assignment;
        require!(assignment.status == AssignmentStatus::Finalized, ZcgError::AssignmentNotReady);
        require!(assignment.student == ctx.accounts.student.key(), ZcgError::Unauthorized);
        assignment.nft_minted = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 8 + 1,
        seeds = [b"user-stats", user.key().as_ref()],
        bump
    )]
    pub user_stats: Account<'info, UserStats>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateUser<'info> {
    #[account(
        mut,
        seeds = [b"user-stats", owner.key().as_ref()],
        bump = user_stats.bump,
    )]
    pub user_stats: Account<'info, UserStats>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(content_url: String)]
pub struct SubmitAssignment<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 200 + 1 + 1 + 4 + 4 + 1,
        seeds = [b"assignment", user.key().as_ref(), anchor_lang::solana_program::hash::hash(content_url.as_bytes()).as_ref()],
        bump
    )]
    pub assignment: Account<'info, Assignment>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitReview<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 1 + 100 + 1,
        seeds = [b"review", user.key().as_ref(), assignment.key().as_ref()],
        bump
    )]
    pub review: Account<'info, Review>,
    #[account(mut)]
    pub assignment: Account<'info, Assignment>,
    #[account(mut, seeds = [b"user-stats", user.key().as_ref()], bump = user_stats.bump)]
    pub user_stats: Account<'info, UserStats>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateChannel<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 4 + 1,
        seeds = [b"channel", anchor_lang::solana_program::hash::hash(name.as_bytes()).as_ref()],
        bump
    )]
    pub channel: Account<'info, Channel>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SendInvite<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 32 + 1 + 1,
        seeds = [b"invite", user.key().as_ref(), receiver.key().as_ref(), assignment.key().as_ref()],
        bump
    )]
    pub invite: Account<'info, Invite>,
    pub receiver: Account<'info, UserStats>,
    pub assignment: Account<'info, Assignment>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeAssignment<'info> {
    #[account(mut)]
    pub assignment: Account<'info, Assignment>,
    #[account(mut)]
    pub student: Signer<'info>,
}

#[account]
pub struct UserStats {
    pub owner: Pubkey,
    pub name: String,
    pub reputation: u64,
    pub completed_assignments: u32,
    pub completed_reviews: u32,
    pub bump: u8,
}

#[account]
pub struct Assignment {
    pub student: Pubkey,
    pub content_url: String,
    pub status: AssignmentStatus,
    pub average_grade: u8,
    pub review_count: u8,
    pub total_grade: u32,
    pub nft_minted: bool,
    pub bump: u8,
}

#[account]
pub struct Review {
    pub reviewer: Pubkey,
    pub assignment: Pubkey,
    pub grade: u8,
    pub comment: String,
    pub bump: u8,
}

#[account]
pub struct Channel {
    pub creator: Pubkey,
    pub name: String,
    pub member_count: u32,
    pub bump: u8,
}

#[account]
pub struct Invite {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub assignment: Pubkey,
    pub status: InviteStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AssignmentStatus {
    Submitted,
    Finalized,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum InviteStatus {
    Pending,
    Accepted,
    Rejected,
}

#[error_code]
pub enum ZcgError {
    #[msg("The assignment is not yet ready for finalization.")]
    AssignmentNotReady,
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Insufficient reputation to perform this action.")]
    InsufficientReputation,
    #[msg("Assignment is already finalized.")]
    AssignmentAlreadyFinalized,
    #[msg("Invalid grade provided. Must be between 0 and 100.")]
    InvalidGrade,
    #[msg("Content URL is too long.")]
    ContentUrlTooLong,
    #[msg("Comment is too long.")]
    CommentTooLong,
}
