import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Zcg } from "../target/types/zcg";
import { expect } from "chai";

describe("zcg", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const idl = JSON.parse(require("fs").readFileSync("./target/idl/zcg.json", "utf8"));
  const program = new anchor.Program(idl as any, anchor.getProvider()) as any;
  const user = anchor.AnchorProvider.env().wallet;

  it("Initializes a user", async () => {
    const [userStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user-stats"), user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeUser("Khabib")
      .accounts({
        userStats: userStatsPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    const userStats = await program.account.userStats.fetch(userStatsPDA);
    expect(userStats.name.toString()).to.equal("Khabib");
    expect(userStats.reputation.toString()).to.equal("100");
  });

  it("Submits an assignment", async () => {
    const contentUrl = "https://example.com/assignment1";
    const [assignmentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("assignment"), user.publicKey.toBuffer(), Buffer.from(anchor.utils.sha256.hash(contentUrl), "hex")],
      program.programId
    );

    await program.methods
      .submitAssignment(contentUrl)
      .accounts({
        assignment: assignmentPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .rpc();

    const assignment = await program.account.assignment.fetch(assignmentPDA);
    expect(assignment.contentUrl.toString()).to.equal(contentUrl);
    expect(assignment.status).to.deep.equal({ submitted: {} });
  });

  it("Submits reviews and finalizes assignment", async () => {
    const contentUrl = "https://example.com/assignment1";
    const [assignmentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("assignment"), user.publicKey.toBuffer(), Buffer.from(contentUrl)],
      program.programId
    );

    const [userStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user-stats"), user.publicKey.toBuffer()],
      program.programId
    );

    // Submit 3 reviews
    for (let i = 0; i < 3; i++) {
      const reviewer = anchor.web3.Keypair.generate();

      // Airdrop some SOL to the reviewer
      const signature = await program.provider.connection.requestAirdrop(
        reviewer.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      );
      await program.provider.connection.confirmTransaction(signature);

      const [reviewerStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), reviewer.publicKey.toBuffer()],
        program.programId
      );

      // Initialize reviewer
      await program.methods
        .initializeUser(`Reviewer ${i}`)
        .accounts({
          userStats: reviewerStatsPDA,
          user: reviewer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([reviewer])
        .rpc();

      const [reviewPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("review"), reviewer.publicKey.toBuffer(), assignmentPDA.toBuffer()],
        program.programId
      );

      await program.methods
        .submitReview(85 + i, `Good job ${i}!`)
        .accounts({
          review: reviewPDA,
          assignment: assignmentPDA,
          userStats: reviewerStatsPDA,
          user: reviewer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .signers([reviewer])
        .rpc();
    }

    const assignment = await program.account.assignment.fetch(assignmentPDA);
    expect(assignment.status).to.deep.equal({ finalized: {} });
    expect(assignment.reviewCount.toString()).to.equal("3");

    // Average of 85, 86, 87 is 86
    expect(assignment.averageGrade.toString()).to.equal("86");
  });

  it("Finalizes the assignment (mints NFT placeholder)", async () => {
    const contentUrl = "https://example.com/assignment1";
    const [assignmentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("assignment"), user.publicKey.toBuffer(), Buffer.from(anchor.utils.sha256.hash(contentUrl), "hex")],
      program.programId
    );

    await program.methods
      .finalizeAssignment()
      .accounts({
        assignment: assignmentPDA,
        student: user.publicKey,
      } as any)
      .rpc();

    const assignment = await program.account.assignment.fetch(assignmentPDA);
    expect(assignment.nftMinted).to.be.true;
  });
});
