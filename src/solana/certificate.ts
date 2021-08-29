import {
  setPayerAndBlockhashTransaction,
  signAndSendTransaction,
  WalletAdapter,
} from "./wallet";
import { serialize, deserialize } from "borsh";

import {
  Connection,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
  TransactionInstruction,
} from "@solana/web3.js";
import { programId } from "./program";


// example ipns cid (length 59)
// bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi

const DUMMY_CID = "00000000000000000000000000000000000000000000000000000000000";

// example name (length 32 characters)  
const DUMMY_NAME = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// exmaple shard (length 163 characters)
const DUMMY_SHARD = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

const DUMMY_CREATED_ON = "0000000000000000"; // milliseconds, 16 digits

export class Certificate {
  cid: string = DUMMY_CID;
  bride: string = DUMMY_NAME;
  groom: string = DUMMY_NAME;
  shard: string = DUMMY_SHARD;
  created_on: string = DUMMY_CREATED_ON; // max milliseconds in date
  constructor(
    fields: { 
      cid: string; 
      bride: string; 
      groom:string; 
      shard: string; 
      created_on: string 
    } | undefined = undefined
  ) {
    if (fields) {
      this.cid = fields.cid;
      this.bride = fields.bride;
      this.groom = fields.groom;
      this.shard = fields.shard;
      this.created_on = fields.created_on;
    }
  }
}

const CertificateSchema = new Map([
  [
    Certificate,
    {
      kind: "struct",
      fields: [
        ["cid", "String"],
        ["bride", "String"],
        ["groom", "String"],
        ["shard", "String"],
        ["created_on", "String"],
      ],
    },
  ],
]);

class CertificateService {
  CERTIFICATE_SIZE: number = 0;
  getCertificateSize() {
    const sampleCertificate: Certificate =
      this.getDefaultCertificate();

    let length = 0;
    length += serialize(CertificateSchema, sampleCertificate).length;

    this.CERTIFICATE_SIZE = length;
  }

  constructor() {
    this.getCertificateSize();
  }

  private getDefaultCertificate(): Certificate {
    const certificate = new Certificate();
    return certificate;
  }

  async getAccountMessageHistory(
    connection: Connection,
    pubKeyStr: string
  ): Promise<void> {
    const sentPubkey = new PublicKey(pubKeyStr);
    const sentAccount = await connection.getAccountInfo(sentPubkey);
    // get and deserialize solana account data and receive data
    if (!sentAccount) { 
      throw Error(`Account ${pubKeyStr} does not exist`);
    }
    
    const data = deserialize(CertificateSchema, Certificate, sentAccount.data);
    console.log("Inside Certificate Trying to decrypt", data);
    return data;
  }

  async sendCertificate(
    connection: Connection,
    wallet: WalletAdapter,
    destPubkeyStr: string,
    cid: string,
    bride: string,
    groom: string,
    shard: string,
  ): Promise<RpcResponseAndContext<SignatureResult>> {
    console.log("start sendCertificate");
    const destPubkey = new PublicKey(destPubkeyStr);

    const messageObj = new Certificate();
    messageObj.cid = cid;
    messageObj.bride = this.getFormattedName(bride);
    messageObj.groom = this.getFormattedName(groom);
    messageObj.shard = shard;
    messageObj.created_on = this.getCreatedOn();
    const messageInstruction = new TransactionInstruction({
      keys: [{ pubkey: destPubkey, isSigner: false, isWritable: true }],
      programId,
      data: Buffer.from(serialize(CertificateSchema, messageObj)),
    });
    const trans = await setPayerAndBlockhashTransaction(
      wallet,
      messageInstruction
    );
    const signature = await signAndSendTransaction(wallet, trans);
    const result = await connection.confirmTransaction(
      signature,
      "singleGossip"
    );
    console.log("end sendMessage", result);
    return result;
  }

  private getFormattedName(name: string): string {
    // save message to arweave and get back txid;
    let fmtname = name;
    const dummyLength = DUMMY_NAME.length - fmtname.length;
    for (let i = 0; i < dummyLength; i++) {
      fmtname += "X";
    }

    console.log("Formatted Name: ", fmtname);
    return fmtname;
  }

  // get value and add dummy values
  private getCreatedOn(): string {
    const now = Date.now().toString();
    console.log("now", now);
    const total = DUMMY_CREATED_ON.length;
    const diff = total - now.length;
    let prefix = "";
    for (let i = 0; i < diff; i++) {
      prefix += "0";
    }
    const created_on = prefix + now;
    console.log("created_on", created_on);
    return created_on;
  }
}

const certificateService = new CertificateService();
export default certificateService;
