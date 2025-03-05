/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/charity_nft_platform.json`.
 */
export type CharityNftPlatform = {
    "address": "EzHYHmD5vextLENwqzUuWwcFNkhUmEEcSyipYm6hhajN",
    "metadata": {
      "name": "charityNftPlatform",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "initialize",
        "docs": [
          "Initialisation du programme avec la configuration de la charité"
        ],
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "config",
            "writable": true,
            "signer": true
          },
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "charityWallet"
          },
          {
            "name": "rewardTokenMint",
            "writable": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "rent",
            "address": "SysvarRent111111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "charityWallet",
            "type": "pubkey"
          }
        ]
      },
      {
        "name": "purchaseNft",
        "docs": [
          "Achat d'un NFT : transfert de SOL vers la charité, mint du NFT et attribution de tokens de récompense."
        ],
        "discriminator": [
          217,
          35,
          113,
          146,
          250,
          29,
          8,
          209
        ],
        "accounts": [
          {
            "name": "buyer",
            "writable": true,
            "signer": true
          },
          {
            "name": "config",
            "writable": true
          },
          {
            "name": "charityWallet",
            "writable": true
          },
          {
            "name": "rewardTokenMint",
            "writable": true
          },
          {
            "name": "rewardMintAuthority",
            "writable": true,
            "signer": true
          },
          {
            "name": "buyerRewardTokenAccount",
            "writable": true
          },
          {
            "name": "nftMint",
            "writable": true
          },
          {
            "name": "mintAuthority",
            "writable": true,
            "signer": true
          },
          {
            "name": "buyerNftAccount",
            "writable": true
          },
          {
            "name": "tokenProgram",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "rent",
            "address": "SysvarRent111111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "config",
        "discriminator": [
          155,
          12,
          170,
          224,
          30,
          250,
          204,
          130
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "invalidPrice",
        "msg": "Prix invalide : le NFT doit coûter entre 1 et 5 SOL."
      }
    ],
    "types": [
      {
        "name": "config",
        "docs": [
          "Stocke la configuration du programme."
        ],
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "charityWallet",
              "type": "pubkey"
            },
            {
              "name": "rewardTokenMint",
              "type": "pubkey"
            }
          ]
        }
      }
    ]
  };
  