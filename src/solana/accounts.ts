import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { programId } from "./program";
import {
  setPayerAndBlockhashTransaction,
  signAndSendTransaction,
  WalletAdapter,
} from "./wallet";

export async function getChatMessageAccountPubkey(
  connection: Connection,
  wallet: WalletAdapter,
  space: number,
  reset: boolean = false
): Promise<PublicKey> {
  if (!wallet.publicKey) {
    throw Error("Wallet has no PublicKey");
  }
  let chatAccountPubkey: PublicKey | null = null;
  if (!reset) {
    const existingPubkeyStr = localStorage.getItem(
      wallet.publicKey.toBase58() ?? ""
    );
    if (existingPubkeyStr) {
      chatAccountPubkey = new PublicKey(existingPubkeyStr);
      console.log("chat account found");
      return chatAccountPubkey;
    }
  }
  console.log("start creating new chat account");
  const CERTIFICATE_SEED = "certificate" + Math.random().toString();
  chatAccountPubkey = await PublicKey.createWithSeed(
    wallet.publicKey,
    CERTIFICATE_SEED,
    programId
  );
  console.log("new chat account pubkey", chatAccountPubkey.toBase58());
  console.log("Space require: ", space);
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  const instruction = SystemProgram.createAccountWithSeed({
    fromPubkey: wallet.publicKey,
    basePubkey: wallet.publicKey,
    seed: CERTIFICATE_SEED,
    newAccountPubkey: chatAccountPubkey,
    lamports,
    space,
    programId,
  });
  let trans = await setPayerAndBlockhashTransaction(wallet, instruction);
  console.log("setPayerAndBlockhashTransaction", trans);
  let signature = await signAndSendTransaction(wallet, trans);
  console.log("signAndSendTransaction", signature);
  let result = await connection.confirmTransaction(signature, "singleGossip");
  console.log("new chat account created", result);
  localStorage.setItem(
    wallet.publicKey.toBase58(),
    chatAccountPubkey.toBase58()
  );
  return chatAccountPubkey;
}
