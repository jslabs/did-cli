#!/usr/bin/env node

import { Command } from "commander";
import nacl from "tweetnacl";
import fs from "fs";
import crypto from "crypto";
import util from "tweetnacl-util";
import bs58 from "bs58";

const program = new Command();

/**
 * Utils
 */
function toMultibase(publicKeyBytes) {
    return "z" + bs58.encode(publicKeyBytes);
}

function generateKeys() {
    const keyPair = nacl.sign.keyPair();

    return {
        publicKey: Buffer.from(keyPair.publicKey).toString("base64"),
        privateKey: Buffer.from(keyPair.secretKey).toString("base64"),
        publicKeyMultibase: toMultibase(keyPair.publicKey)
    };
}

function hashFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("File not found: " + filePath);
    }

    const data = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(data).digest("hex");
}

function signMessage(privateKeyBase64, message) {
    const secretKey = Buffer.from(privateKeyBase64, "base64");
    const msg = util.decodeUTF8(message);

    const sig = nacl.sign.detached(msg, secretKey);
    return Buffer.from(sig).toString("base64");
}

function verifyMessage(publicKeyBase64, message, signatureBase64) {
    const publicKey = Buffer.from(publicKeyBase64, "base64");
    const signature = Buffer.from(signatureBase64, "base64");
    const msg = util.decodeUTF8(message);

    return nacl.sign.detached.verify(msg, signature, publicKey);
}

/**
 * CLI commands
 */

program
    .name("did-cli")
    .description("Minimal DID-style crypto CLI")
    .version("1.0.0");

/**
 * gen
 */
program
    .command("gen")
    .description("Generate Ed25519 keypair")
    .action(() => {
        console.log(JSON.stringify(generateKeys(), null, 2));
    });

/**
 * hash
 */
program
    .command("hash")
    .description("Hash a file (SHA-256)")
    .argument("<filePath>")
    .action((filePath) => {
        console.log(hashFile(filePath));
    });

/**
 * sign
 */
program
    .command("sign")
    .description("Sign a message with private key")
    .argument("<privateKey>")
    .argument("<message>")
    .action((privateKey, message) => {
        console.log(signMessage(privateKey, message));
    });

/**
 * verify
 */
program
    .command("verify")
    .description("Verify a signature")
    .argument("<publicKey>")
    .argument("<message>")
    .argument("<signature>")
    .action((publicKey, message, signature) => {
        const valid = verifyMessage(publicKey, message, signature);
        console.log(valid ? "VALID" : "INVALID");
    });

program.parse();
